'use client';

import { FLASK_SERVER_URL } from '@/lib/constants';
import { showErrorNotification } from '@/lib/notifications/notifications';
import { CompilationResult } from '@/lib/types';
import {
    createContext, useContext, useState, ReactNode,
    useMemo,
    useEffect,
} from 'react';

interface ImageContextProps {
    isServerAlive: boolean;
    base64Image: string;
    setBase64Image: (image: string) => void;
    code: string;
    setCode: (code: string) => void;
    codeInputText: string;
    setCodeInputText: (code: string) => void;
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
    const [codeInputText, setCodeInputText] = useState('');
    const [correctedCode, setCorrectedCode] = useState('');
    const [isExtracted, setIsExtracted] = useState<boolean>(false);
    const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);
    const [language, setLanguage] = useState<string | null>('');

    const [isServerAlive, setIsServerAlive] = useState<boolean>(false);

    // ping the server to check if it is alive
    useEffect(() => {
        fetch(`${FLASK_SERVER_URL}/ping`, {
            signal: AbortSignal.timeout(5000),
        })
            .then((res) => {
                if (res.ok) {
                    setIsServerAlive(true);
                } else {
                    showErrorNotification({
                        title: 'Server Error',
                        message: 'Server is not responding. Please try again later.',
                    });
                }
            })
            .catch(() => {
                showErrorNotification({
                    title: 'Server Error',
                    message: 'Our image processing server is not responding. Please try again later.',
                });
                setIsServerAlive(false);
            });
    }, []);

    const value = useMemo(() => ({
        isServerAlive,
        base64Image,
        setBase64Image,
        code,
        setCode,
        codeInputText,
        setCodeInputText,
        language,
        setLanguage,
        correctedCode,
        setCorrectedCode,
        isExtracted,
        setIsExtracted,
        compilationResult,
        setCompilationResult,
    }), [
        isServerAlive,
        base64Image,
        setBase64Image,
        code,
        setCode,
        codeInputText,
        setCodeInputText,
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
