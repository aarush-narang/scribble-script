'use client';

import { useRef, useState, JSX } from 'react';
import Image from 'next/image';
import {
    Text, SimpleGrid, Button,
    useMantineColorScheme,
    useMantineTheme,
    Group,
} from '@mantine/core';
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { useData } from '../editor/DataContext';

interface FilePreview {
    key: string;
    src: string;
    alt: string;
    className: string;
}

interface FilePreviewData {
    key: string;
    base64: string;
    preview: JSX.Element;

}

type Props = {
    disabled: boolean;
}

function UploadPage({ disabled }: Props) {
    const {
        base64Image, setBase64Image, setCode, setIsExtracted,
    } = useData();

    const openRef = useRef<() => void>(null);
    const [files, setFiles] = useState<FileWithPath[]>([]);
    const [previewList, setPreviewList] = useState<FilePreviewData[]>([]);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const [extracting, setExtracting] = useState<boolean>(false);

    const handleDrop = (acceptedFiles: FileWithPath[]) => {
        setFiles(acceptedFiles);
        setCode(""); // Reset the code
        setIsExtracted(false); // Reset the extracted state

        // Create previews and base64 conversions, I only care abt the first file for now
        if (acceptedFiles) {
            for (const file of acceptedFiles) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setBase64Image(base64String);
                    setUploadedImage(base64String);
                    const preview: FilePreview = {
                        key: file.name,
                        src: base64String,
                        alt: file.name,
                        className: "max-h-48 max-w-48 m-2",
                    };
                    setPreviewList([
                        ...previewList,
                        {
                            key: file.name,
                            base64: base64String,
                            preview: <Image
                                key={preview.key}
                                src={preview.src}
                                alt={preview.alt}
                                className={preview.className}
                                height={50}
                                width={50}
                            />,
                        },
                    ]);
                };
                reader.readAsDataURL(file); // Convert to base64
                console.log("Done converting: ", new Date());
            }
        }
    };

    const extractText = () => {
        setExtracting(true);
        fetch("https://server.scribblescript.tech/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: base64Image, dev_env: true }),
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log("End img process: ", new Date());
                console.log("Response from server:", data);
                setCode(data.result);
                setExtracting(false);
            })
            .catch((err) => console.error("Error:", err));
    };

    return (
        <div className="flex flex-col w-full">
            <Dropzone
                openRef={openRef}
                onDrop={handleDrop}
                accept={[
                    MIME_TYPES.png,
                    MIME_TYPES.jpeg,
                ]}
                radius="lg"
                p={25}
                disabled={extracting || disabled}
            >
                {uploadedImage ? (
                    <div className="flex justify-center">
                        <Image
                            src={uploadedImage}
                            alt="uploaded file"
                            width={600}
                            height={600}
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center bg-blue-500 bg-opacity-10 rounded-lg p-4 py-32">
                        <Image
                            src="/fileupload.png"
                            alt="file upload"
                            width={100}
                            height={100}
                        />
                        <div className="flex justify-center">Drag Image here or click to select</div>
                    </div>
                )}
            </Dropzone>

            <Group className="flex flex-row mt-4 w-full" style={{ gap: 8 }}>
                <Button
                    className="grow"
                    onClick={() => openRef.current?.()}
                    disabled={extracting || disabled}
                >
                    Select File
                </Button>
                <Button
                    className="grow"
                    disabled={files.length === 0 || disabled}
                    onClick={() => {
                        extractText();
                    }}
                    loading={extracting}
                >
                    Extract Text
                </Button>
            </Group>

        </div>
    );
}

export default UploadPage;
