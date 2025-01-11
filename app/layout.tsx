import "./globals.css";
import '@mantine/core/styles.css';
import {
    ColorSchemeScript, mantineHtmlProps,
} from '@mantine/core';

import type { Metadata } from "next";
import { ReactNode } from "react";
import { FontRounded } from "@/lib/fonts";
import { AppProvider } from "@/components/providers/AppProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ImageProvider } from "@/components/editor/ImageContext";

export const metadata: Metadata = {
    title: "Scribble Script",
    description: "A platform to convert your hand-written code into digital submissions.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
                {
                    process.env.NODE_ENV === 'production' && (
                        //! TODO: Replace the Google Analytics ID with the actual ID
                        <GoogleAnalytics gaId="G-3BLM888FWY" />
                    )
                }
            </head>
            <body className={FontRounded.className}>
                <ImageProvider>
                    <AppProvider fontFamily={FontRounded.style.fontFamily}>
                        {children}
                    </AppProvider>
                </ImageProvider>

            </body>
        </html>
    );
}
