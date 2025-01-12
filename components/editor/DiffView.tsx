'use client';

import { useMantineColorScheme } from '@mantine/core';
import React from 'react';
import ReactDiffViewer from 'react-diff-viewer';

// create a new prop to feed in anthropic code and original code

interface DiffViewProps {
    oldCode: string,
    newCode: string
}

export function DiffView({ oldCode, newCode }: DiffViewProps) {
    const scheme = useMantineColorScheme();

    return (
        <div className="w-full">
            <ReactDiffViewer
                oldValue={oldCode}
                newValue={newCode}
                splitView
                useDarkTheme={scheme.colorScheme === 'dark'}
            />
        </div>
    );
}
