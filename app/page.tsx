'use client';

import {
    Button, FileInput, Group, Tooltip, useMantineColorScheme,
} from "@mantine/core";
import UploadPage from "@/components/upload/UploadPage";
import { useState, useEffect } from "react";
import CodeEditor from "@/components/editor/CodeEditor";
import { useData } from "@/components/editor/DataContext";
import ColorSwap from "@/components/ColorSwap";
import Output from "@/components/output/Output";
import { CompilationResult } from "@/lib/types";
import { correctCode } from "@/lib/anthropic/api";
import { DiffView } from "@/components/editor/DiffView";

export default function Home() {
    const {
        code,
        setCode,
        correctedCode,
        isExtracted,
        setIsExtracted,
        setCompilationResult,
        language,
        compilationResult,
        setCorrectedCode,
        codeInputText,
        setCodeInputText,
    } = useData();

    const [inputFile, setInputFile] = useState<File | null>(null);

    const [showAnthropic, setShowAnthropic] = useState<boolean>(false);
    const [compiling, setCompiling] = useState<boolean>(false);
    const [correcting, setCorrecting] = useState<boolean>(false);

    useEffect(() => {
        if (code && !isExtracted) {
            setIsExtracted(true);
        }
    }, [code]);

    useEffect(() => {
        // read the text file into a string -> setCodeInput
        if (inputFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setCodeInputText(text);
            };

            reader.onerror = (e) => {
                console.error("File reading error: ", e);
            };

            reader.readAsText(inputFile);
        }
    }, [inputFile]);

    const handleCompile = async () => {
        setCompiling(true);

        return fetch("https://server.scribblescript.tech/compile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code, language, input: codeInputText,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setCompiling(false);
                setCompilationResult(data as CompilationResult);
            });
    };

    const handleClaude = async () => {
        setCompilationResult(null);
        setCorrecting(true);
        const result = await correctCode(code, language as "py" | "cpp");
        setCorrectedCode(result);
        setShowAnthropic(true);
        setCorrecting(false);
    };

    const convertedLang = language === "py" ? "Python" : "C++";

    return (
        <section className="flex w-full items-center justify-center mt-4 mb-10">
            <div className="flex flex-col w-full max-w-7xl mx-10 gap-6">
                <div className="shadow-md rounded-lg p-8">
                    <UploadPage disabled={compiling || correcting || correctedCode !== ""} />
                </div>
                {isExtracted && (
                    <div className="flex flex-col">
                        <Group gap={8}>
                            <CodeEditor disabled={compiling || correcting || correctedCode !== ""} />
                            <Tooltip label="If your program requires input from the standard input, you can upload a file containing the input here" position="top">
                                <FileInput
                                    accept=".txt"
                                    className="w-full"
                                    placeholder="Upload an input file (optional)"
                                    value={inputFile}
                                    onChange={(file) => setInputFile(file)}
                                    disabled={compiling || correcting || correctedCode !== "" || !code}
                                />
                            </Tooltip>
                        </Group>

                        <div className="grid grid-cols-2 mt-3" style={{ gap: 8 }}>
                            <Tooltip label={language ? `Correcting in ${convertedLang}` : "Select a language"} position="top">
                                <Button
                                    color="violet"
                                    className="w-full"
                                    onClick={handleClaude}
                                    disabled={!language || !code || compiling || correcting || correctedCode !== ""}
                                    loading={correcting}
                                >
                                    Correct With Claude
                                </Button>
                            </Tooltip>
                            <Tooltip label={language ? `Compiling in ${convertedLang}` : "Select a language"} position="top">
                                <Button
                                    className="w-full"
                                    onClick={handleCompile}
                                    loading={compiling}
                                    disabled={!language || correcting || correctedCode !== ""}
                                >
                                    Compile
                                    {" "}
                                    {codeInputText ? "With Input" : ""}
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                )}

                {showAnthropic && (
                    <div className="flex flex-col">
                        <DiffView oldCode={code} newCode={correctedCode} />
                        <div className="grid grid-cols-2 mt-2" style={{ gap: 8 }}>
                            <Button
                                color="red"
                                className="grow"
                                onClick={() => {
                                    setShowAnthropic(false);
                                    setCorrectedCode("");
                                }}
                            >
                                Reject
                            </Button>
                            <Button
                                color="teal"
                                className="grow"
                                onClick={() => {
                                    setCode(correctedCode);
                                    setCorrectedCode("");
                                    setShowAnthropic(false);
                                }}
                            >
                                Accept
                            </Button>
                        </div>
                    </div>
                )}

                {compilationResult && (
                    <div className="flex flex-col">
                        <Output compilationResult={compilationResult} />
                    </div>
                )}

            </div>
            <ColorSwap />
        </section>

    );
}
