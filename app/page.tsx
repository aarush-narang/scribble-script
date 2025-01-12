'use client';

import { Button, useMantineColorScheme } from "@mantine/core";
import { useState } from "react";
import CodeMirrorEditor from "@/components/editor/CodeMirrorEditor";
import { useImage } from "@/components/editor/ImageContext";
import UploadPage from "./upload/page";

export default function Home() {
    const colorScheme = useMantineColorScheme();

    const [initialCode, setInitialCode] = useState<string>("// Write your code here...");
    const { base64Image, setBase64Image } = useImage();
    const [extract, setExtract] = useState<boolean>(false);

    return (
        <div className="ml-4">
            <h1>Home</h1>
            <Button onClick={() => colorScheme.toggleColorScheme()}>swap</Button>
            <UploadPage setExtract={setExtract} setBase64Image={setBase64Image} />

            {extract && (
                <div>
                    <h1>My CodeMirror Editor</h1>
                    <CodeMirrorEditor base64Image={base64Image} onChange={setInitialCode} />
                </div>
            )}
        </div>
    );
}
