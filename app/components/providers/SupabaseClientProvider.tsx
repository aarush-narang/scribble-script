"use client";

import { SupabaseClient } from "@supabase/supabase-js";
import {
    ReactNode, createContext, useContext, useMemo,
} from "react";
import { createSupabaseClient } from "@/lib/supabase/supabase-client";

type SupabaseClientContextType = {
    supabaseClient: SupabaseClient;
}

const SupabaseClientContext = createContext<SupabaseClientContextType>({
    supabaseClient: {} as SupabaseClient,
});

type Props = {
    children: ReactNode;
}

export function SupabaseClientProvider({ children }: Props) {
    const value = useMemo(() => ({
        supabaseClient: createSupabaseClient(),
    }), []);

    return (
        <SupabaseClientContext.Provider value={value}>
            {children}
        </SupabaseClientContext.Provider>
    );
}

export const useSupabaseClient = () => {
    const context = useContext(SupabaseClientContext);

    if (!context) {
        throw new Error("useSupabaseClient must be used within a SupabaseClientProvider");
    }

    return context.supabaseClient;
};
