'use client';

// components/CodeMirrorEditor.js
import Editor from "react-simple-code-editor";
// @ts-expect-error types not up to date
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/themes/prism-tomorrow.css';

import { Select } from "@mantine/core";
import { useData } from "../providers/DataProvider";

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-python';

type Props = {
    disabled: boolean;
}

export default function CodeEditor({ disabled }: Props) {
    const {
        code, setCode, language, setLanguage,
    } = useData();

    return (
        <div className="relative w-full">
            <Editor
                className="w-full"
                value={code}
                onValueChange={(c) => setCode(c)}
                highlight={(c) => highlight(c, language === "py" ? languages.python : languages.clike)}
                padding={10}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 18,
                    border: '1px solid #d1d5db',
                    borderRadius: 5,
                }}
                textareaClassName="outline-none"
                disabled={disabled}
            />
            <Select
                className="absolute top-2 right-2 max-w-fit"
                data={[
                    { value: "cpp", label: "C++" },
                    { value: "py", label: "Python" },
                ]}
                allowDeselect={false}
                placeholder="Select language"
                value={language}
                withCheckIcon={false}
                onChange={(value) => setLanguage(value)}
                disabled={disabled}
            />
        </div>
    );
}
