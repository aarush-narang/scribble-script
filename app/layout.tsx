import "./globals.css";
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';

import {
    ColorSchemeScript, mantineHtmlProps,
} from '@mantine/core';

import type { Metadata } from "next";
import { ReactNode } from "react";
import { FontRounded } from "@/lib/fonts";
import { AppProvider } from "@/components/providers/AppProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { DataProvider } from "@/components/providers/DataProvider";
import { Navbar } from "@/components/Navbar";

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
                <DataProvider>
                    <AppProvider fontFamily={FontRounded.style.fontFamily}>
                        <Navbar />
                        {children}
                    </AppProvider>
                </DataProvider>

            </body>
        </html>
    );
}
