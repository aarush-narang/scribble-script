'use client';

import {
    createContext, useContext, useState, ReactNode,
    useMemo,
} from 'react';

interface ImageContextProps {
    base64Image: string;
    setBase64Image: (image: string) => void;
}

const ImageContext = createContext<ImageContextProps | null>(null);

export function ImageProvider({ children }: { children: ReactNode }) {
    const [base64Image, setBase64Image] = useState<string>('');

    const value = useMemo(
        () => ({
            base64Image,
            setBase64Image: (image: string) => setBase64Image(image),
        }),
        [base64Image, setBase64Image],
    );

    return (
        <ImageContext.Provider value={value}>
            {children}
        </ImageContext.Provider>
    );
}

export const useImage = () => {
    const context = useContext(ImageContext);
    if (!context) throw new Error('useImage must be used within an ImageProvider');
    return context;
};
