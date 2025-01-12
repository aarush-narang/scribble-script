'use client';

import React from 'react';
import { useMantineColorScheme } from "@mantine/core";
import { CompilationResult } from '@/lib/types';

function Output({ compilationResult }: { compilationResult: CompilationResult}) {
    const { colorScheme } = useMantineColorScheme();
    const textColor = colorScheme === 'dark' ? 'text-white' : 'black';
    const bgColor = colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
    const erColor = colorScheme === 'dark' ? 'text-red-400' : 'text-red-700';

    function parseResult(result: string) {
        const uuid = `${result.split(' ')[0].split('/').splice(0, 2).join('/')}/`;
        const filtered = result.replaceAll(uuid, '');
        return filtered;
    }

    return (
        <pre className={`${bgColor} ${compilationResult.stderr ? erColor : textColor} font-mono p-4 rounded-lg`}>
            {compilationResult.stderr ? `${parseResult(compilationResult.stderr)}` : compilationResult.result || 'Error: No result'}
        </pre>
    );
}

export default Output;
