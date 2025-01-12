"use client";

import React from 'react';
import {
    Group, Text, Title, useMantineColorScheme, useMantineTheme,
} from '@mantine/core';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

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
            <div className="flex justify-between items-center w-full max-w-7xl">
                <Link href="/">
                    <Text
                        component={Title}
                        order={2}
                        variant="gradient"
                        gradient={{
                            from: 'hsl(200, 56%, 50%)', to: 'hsl(180, 27%, 29%)', deg: 135,
                        }}
                    >
                        scribble.
                    </Text>
                </Link>
                <Link
                    href="https://github.com/aarush-narang/scribble-script"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                >
                    <FaGithub className="z-0" size={30} z={0} />
                </Link>
            </div>
        </header>
    );
}

export default Navbar;
