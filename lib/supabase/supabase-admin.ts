import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_KEY as string,
);
