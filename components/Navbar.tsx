"use client";

import React from 'react';
import { Group, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import Link from 'next/link';

export function Navbar() {
    const theme = useMantineTheme();
    const scheme = useMantineColorScheme();

    return (
        <header
            className="flex items-center justify-center w-full h-16 p-5"
            style={{
                backgroundColor: scheme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
                borderBottom: `1px solid ${scheme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
            }}
        >
            <div className="flex space-between w-full max-w-7xl">
                <Group className="flex items-center">
                    <Link href="/" className="underline">ScribbleScript</Link>
                    <Link
                        href="https://github.com/aarush-narang/scribble-script"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        GitHub
                    </Link>
                    <Link
                        href="https://github.com/kelvinjou/iPadScribbleScript"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        GitHub - Mobile App
                    </Link>
                </Group>
                <div />
            </div>
        </header>
    );
}

export default Navbar;
