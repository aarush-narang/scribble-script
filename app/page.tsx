'use client';

import {
    Button, Tooltip, useMantineColorScheme,
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
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const {
        code, setCode, correctedCode, isExtracted, setIsExtracted, setCompilationResult, language, compilationResult, setCorrectedCode,
    } = useData();

    const [showAnthropic, setShowAnthropic] = useState<boolean>(false);
    const [compiling, setCompiling] = useState<boolean>(false);
    const [correcting, setCorrecting] = useState<boolean>(false);

    useEffect(() => {
        if (code && !isExtracted) {
            setIsExtracted(true);
        }
    }, [code]);

    // Ensure the color scheme is set to 'light' by default
    useEffect(() => {
        if (!colorScheme) {
            toggleColorScheme();
        }
    }, [colorScheme, toggleColorScheme]);

    const handleCompile = async () => {
        setCompiling(true);

        return fetch("https://server.scribblescript.tech/compile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code, language, input: "123", expected: "123",
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
                        <CodeEditor disabled={compiling || correcting || correctedCode !== ""} />
                        <div className="grid grid-cols-2 mt-2" style={{ gap: 8 }}>
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
