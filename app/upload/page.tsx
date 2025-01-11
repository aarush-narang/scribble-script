'use client'
import { useRef, useState, JSX } from 'react';
import { Text, Image, SimpleGrid, Button } from '@mantine/core';
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';

interface FilePreview {
    key: string;
    src: string;
    alt: string;
    className: string;
}

interface UploadPageProps {
    setExtract: (value: boolean) => void,
    setBase64Image: (code: string) => void;
}

function UploadPage( {setExtract, setBase64Image}: UploadPageProps ) {
    const openRef = useRef<() => void>(null);
    const [files, setFiles] = useState<FileWithPath[]>([]);
    const [previews, setPreviews] = useState<JSX.Element[]>([]);

    const handleDrop = (acceptedFiles: FileWithPath[]) => {
        setFiles(acceptedFiles);

        // Create previews and base64 conversions, I only care abt the first file for now
        if (acceptedFiles) {
            for (const file of acceptedFiles) {
                const reader = new FileReader();
                reader.onloadend = () => {
                const base64String = reader.result as string;
                setBase64Image(base64String);
                const preview: FilePreview = {
                    key: file.name,
                    src: base64String,
                    alt: file.name,
                    className: "max-h-48 max-w-48 m-2",
                };
                setPreviews([
                    ...previews,
                    <Image
                        key={preview.key}
                        src={preview.src}
                        alt={preview.alt}
                        className={preview.className}
                    />,
                ]);
            };
            reader.readAsDataURL(file); // Convert to base64
            console.log("Done converting: ", new Date());
            }
        }
    };

    return (
        <div className='flex flex-col items-center'>
            <Dropzone
                openRef={openRef}
                onDrop={handleDrop}
                accept={[
                    MIME_TYPES.png,
                    MIME_TYPES.jpeg,
                ]}
            >
                <div className="flex justify-center bg-blue-500 bg-opacity-10 rounded-lg p-4 py-10 m-4 mx-40">Drag Image here or click to select</div>
            </Dropzone>

            <div className="flex justify-center">
                <Button onClick={() => openRef.current?.()}>Select File</Button>
            </div>

            <SimpleGrid cols={{ base: 1, sm: 4 }} mt={previews.length > 0 ? 'xl' : 0} className='justify-center'>
                {previews.map((preview) => (preview))}
            </SimpleGrid>

            <div className="flex justify-center m-4">
                <Button disabled={files.length == 0} onClick={() => {
                    setExtract(true);
                }}>Extract Text</Button>
            </div>
        </div>
    );
};

export default UploadPage;