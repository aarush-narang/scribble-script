"use client";

import { Button, useMantineColorScheme } from "@mantine/core";

export default function Home() {
    const colorScheme = useMantineColorScheme();

    return (
        <div>
            <h1>Home</h1>
            <Button onClick={() => colorScheme.toggleColorScheme()}>swap</Button>
        </div>
    );
}
