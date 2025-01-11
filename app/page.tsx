"use client";

import { Button, useMantineColorScheme } from "@mantine/core";

export default function Home() {
    const colorScheme = useMantineColorScheme();
    // create int list with selected images
    const [selectedImages, setSelectedImages]

    return (
        <div>
            <div>
                <Button onClick={() => colorScheme.toggleColorScheme()}>Upload</Button>
            </div>
            <div>
                Image View
            </div>
            <div>
                <Button onClick={() => colorScheme.toggleColorScheme()}>Extract</Button>
            </div>
            <br>
            <div> // Code editor view

            </div>
        </div>
    );
}
