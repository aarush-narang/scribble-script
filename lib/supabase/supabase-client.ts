import { createBrowserClient } from '@supabase/ssr';
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export default createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
);

export function createSupabaseClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
}
