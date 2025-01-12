'use client';

import { CompilationResult } from '@/lib/types';
import {
    createContext, useContext, useState, ReactNode,
    useMemo,
} from 'react';

interface ImageContextProps {
    base64Image: string;
    setBase64Image: (image: string) => void;
    code: string;
    setCode: (code: string) => void;
    language: string | null;
    setLanguage: (language: string | null) => void;
    correctedCode: string;
    setCorrectedCode: (correctedCode: string) => void;
    isExtracted: boolean;
    setIsExtracted: (extracted: boolean) => void;
    compilationResult: CompilationResult | null;
    setCompilationResult: (result: CompilationResult | null) => void;
}

const ImageContext = createContext<ImageContextProps | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
    const [base64Image, setBase64Image] = useState<string>('');
    const [code, setCode] = useState('');
    const [correctedCode, setCorrectedCode] = useState('');
    const [isExtracted, setIsExtracted] = useState<boolean>(false);
    const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);
    const [language, setLanguage] = useState<string | null>('');

    const value = useMemo(() => ({
        base64Image,
        setBase64Image,
        code,
        setCode,
        language,
        setLanguage,
        correctedCode,
        setCorrectedCode,
        isExtracted,
        setIsExtracted,
        compilationResult,
        setCompilationResult,
    }), [
        base64Image,
        setBase64Image,
        code,
        setCode,
        language,
        setLanguage,
        correctedCode,
        setCorrectedCode,
        isExtracted,
        setIsExtracted,
        compilationResult,
        setCompilationResult,
    ]);

    return (
        <ImageContext.Provider value={value}>
            {children}
        </ImageContext.Provider>
    );
}

export const useData = () => {
    const context = useContext(ImageContext);
    if (!context) throw new Error('useImage must be used within an ImageProvider');
    return context;
};
