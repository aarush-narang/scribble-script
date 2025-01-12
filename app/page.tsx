'use client';

import {
    Button, Group, Tooltip, useMantineColorScheme,
} from "@mantine/core";
import UploadPage from "@/components/upload/UploadPage";
import { useState, useEffect } from "react";
import CodeEditor from "@/components/editor/CodeEditor";
import { useData } from "@/components/editor/DataContext";
import ColorSwap from "@/components/ColorSwap";
import { CompilationResult } from "@/lib/types";
import { correctCode } from "@/lib/anthropic/api";
import { DiffView } from "@/components/editor/DiffView";

export default function Home() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const {
        code, setCode, correctedCode, isExtracted, setIsExtracted, setCompilationResult, language, setCorrectedCode,
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
                code, input: "123", language, expected: "123",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setCompiling(false);
                setCompilationResult(data as CompilationResult);
            });
    };

    const handleClaude = async () => {
        setCorrecting(true);
        const result = await correctCode(code);
        setCorrectedCode(result);
        setShowAnthropic(true);
        setCorrecting(false);
    };

    return (
        <section className="flex w-full items-center justify-center mt-4 mb-10">
            <div className="flex flex-col w-full max-w-7xl mx-10 gap-6">
                <div
                    className="shadow-md rounded-lg p-8"
                    style={{ backgroundColor: colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100' }}
                >
                    <UploadPage disabled={compiling || correcting || correctedCode !== ""} />
                </div>
                <div>
                    {isExtracted && (
                        <div className="flex flex-col">
                            <CodeEditor disabled={compiling || correcting || correctedCode !== ""} />
                            <div className="flex flex-row mt-2 gap-2">
                                <Button
                                    className="grow"
                                    onClick={handleClaude}
                                    disabled={!code || correcting || correctedCode !== ""}
                                    loading={correcting}
                                >
                                    Correct With Claude
                                </Button>
                                <Tooltip label={language ? `Compiling in ${language}` : "Select a language"} position="top">
                                    <Group className="flex grow">
                                        <Button
                                            className="grow"
                                            onClick={handleCompile}
                                            loading={compiling}
                                            disabled={!language || correcting}
                                        >
                                            Compile
                                        </Button>
                                    </Group>
                                </Tooltip>
                            </div>
                        </div>
                    )}
                </div>

                {showAnthropic && (
                    <Group className="flex flex-col">
                        <DiffView oldCode={code} newCode={correctedCode} />
                        <Group className="w-full" style={{ gap: 8 }}>
                            <Button
                                className="grow"
                                onClick={() => {
                                    setCode(correctedCode);
                                    setCorrectedCode("");
                                    setShowAnthropic(false);
                                }}
                            >
                                Accept
                            </Button>
                            <Button
                                className="grow"
                                onClick={() => {
                                    setShowAnthropic(false);
                                    setCorrectedCode("");
                                }}
                            >
                                Reject
                            </Button>
                        </Group>
                    </Group>
                )}
            </div>
            <ColorSwap />
        </section>

    );
}
