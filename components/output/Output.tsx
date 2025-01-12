'use client';

import React from 'react';
import { useMantineColorScheme } from "@mantine/core";
import { CompilationResult } from '@/lib/types';

function parseResult(result: string) {
    return result.replace(/(\/)?(app)?(\/)?temp\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\//g, '');
}

function Output({ compilationResult }: { compilationResult: CompilationResult}) {
    const { colorScheme } = useMantineColorScheme();
    const textColor = colorScheme === 'dark' ? 'text-white' : 'black';
    const bgColor = colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
    const erColor = colorScheme === 'dark' ? 'text-red-400' : 'text-red-700';

    console.log(compilationResult);

    return (
        <pre className={`${bgColor} ${compilationResult.stderr ? erColor : textColor} font-mono p-4 rounded-lg`}>
            {compilationResult.stderr ? `${parseResult(compilationResult.stderr)}` : compilationResult.result || 'Error: No result'}
        </pre>
    );
}

export default Output;
