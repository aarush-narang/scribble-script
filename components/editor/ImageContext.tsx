'use client'
import { createContext, useContext, useState } from 'react';

interface ImageContextProps {
    base64Image: string;
    setBase64Image: (image: string) => void;
}

const ImageContext = createContext<ImageContextProps | null>(null);

import { ReactNode } from 'react';



export const ImageProvider = ({ children }: { children: ReactNode }) => {
    const [base64Image, setBase64Image] = useState<string>('');
    return (
        <ImageContext.Provider value={{ base64Image, setBase64Image }}>
          {children}
        </ImageContext.Provider>
   );
}

export const useImage = () => {
    const context = useContext(ImageContext);
    if (!context) throw new Error('useImage must be used within an ImageProvider');
    return context;
}