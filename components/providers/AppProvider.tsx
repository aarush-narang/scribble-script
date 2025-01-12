'use client';

import { Notifications } from "@mantine/notifications";
import { ReactNode, useEffect, useState } from "react";
import { SupabaseClientProvider } from "./SupabaseClientProvider";
import { MantineThemeProvider } from "./MantineThemeProvider";

type Props = {
    children: ReactNode;
    fontFamily: string;
}

export function AppProvider({ children, fontFamily }: Props) {
    const [mounted, setMounted] = useState<boolean>(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <MantineThemeProvider fontFamily={fontFamily}>
            <Notifications />
            <SupabaseClientProvider>
                {mounted && children}
            </SupabaseClientProvider>
        </MantineThemeProvider>
    );
}
