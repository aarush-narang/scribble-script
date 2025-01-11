import { Notifications } from "@mantine/notifications";
import { ReactNode } from "react";
import { SupabaseClientProvider } from "./SupabaseClientProvider";
import { MantineThemeProvider } from "./MantineThemeProvider";

type Props = {
    children: ReactNode;
    fontFamily: string;
}

export function AppProvider({ children, fontFamily }: Props) {
    return (
        <MantineThemeProvider fontFamily={fontFamily}>
            <Notifications />
            <SupabaseClientProvider>
                {/* TODO: implement auth */}
                {/* <AuthProvider> */}
                {children}
                {/* </AuthProvider> */}
            </SupabaseClientProvider>
        </MantineThemeProvider>
    );
}
