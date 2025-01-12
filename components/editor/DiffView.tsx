import React from 'react';
import ReactDiffViewer from 'react-diff-viewer';

// create a new prop to feed in anthropic code and original code

interface DiffViewProps {
    oldCode: string,
    newCode: string
}

export function DiffView({ oldCode, newCode }: DiffViewProps) {
    // const oldCode = `
    //     cout << "hi" << endl;
    //     cout << "hirrr" << endl;
    // `;
    // const newCode = `
    //     cout << "hi" << endl;
    //     cout << "hello" << endl;
    // `;

    return (
        <div>
            <ReactDiffViewer
                oldValue={oldCode}
                newValue={newCode}
                splitView
            />
        </div>
    );
}
