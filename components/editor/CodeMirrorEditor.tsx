// components/CodeMirrorEditor.js

// source code modified from: https://github.com/codemirror/basic-setup/blob/main/src/codemirror.ts
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { EditorView } from '@codemirror/view';
import { Compartment, EditorState } from '@codemirror/state';
import {htmlLanguage, html} from "@codemirror/lang-html"
import {javascript} from "@codemirror/lang-javascript"
import {cppLanguage, cpp} from "@codemirror/lang-cpp"

import { basicSetup } from '../../lib/editor/config'; // Adjust path as needed


interface CodeMirrorEditorProps {
  base64Image: string,
  onChange: (doc: string) => void;
}

const languageConf = new Compartment;

// only needed for language autodetection
/*
const autoLanguage = EditorState.transactionExtender.of(tr => {
  if (!tr.docChanged) return null;
  // inspects the first 100 characters and uses regex to find language
  let docIsCPP = /^\s*</.test(tr.newDoc.sliceString(0, 100));
  let stateIsCPP = tr.startState.facet(language) == cppLanguage;
  if (docIsCPP == stateIsCPP) return null
  return {
    effects: languageConf.reconfigure(docIsCPP ? cpp() : cpp())
  }
});
*/

const CodeMirrorEditor = memo(({ base64Image, onChange }: CodeMirrorEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  const [initialCode, setInitialCode] = useState<string>("// Write your code here...");
  const prevBase64ImageRef = useRef<string | null>(null);


  // Function to handle document changes
  const handleDocChange = useCallback((update: any) => {
    if (update.docChanged) {
      onChange(update.state.doc.toString()); // Pass the updated code to the parent
    }
  }, [onChange]);

  // sending data to flask for process, which we'll get back the text
  const sendPostRequest = () => {
    fetch('http://localhost:5000/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( { image: base64Image } ),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log('Response from server:', data);
        setInitialCode(data['result']);
    })
    .catch((err) => console.error('Error:', err));
  };

  // call automatically right on mount (similar to .onAppear)
  useEffect(() => {
    if (base64Image && base64Image !== prevBase64ImageRef.current) {
      sendPostRequest();
      prevBase64ImageRef.current = base64Image; // Update the reference
    }
  }, [base64Image]);


  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const state = EditorState.create({
        doc: initialCode, // Initialize with the initial document
        extensions: [
          basicSetup,
          languageConf.of(cpp()),
          // autoLanguage,
          EditorView.updateListener.of(handleDocChange),
        ],
      });

      viewRef.current = new EditorView({
        state,
        parent: editorRef.current,
      });
    }

    // Cleanup on unmount
    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [initialCode, handleDocChange]);

  return (
    <>
      <div ref={editorRef} style={{ border: '1px solid #ccc', height: '500px' }} />
      <div className="mb-16">
          {/* <h1>Multiline Text Result:</h1>
          {initialCode.split('\n').map((line, index) => (
          <p className="ml-8" key={index}>{line}</p> // Split the text into lines and render each one in a <p> tag
          ))} */}
      </div>
    </>
  );
  
});

export default CodeMirrorEditor;
