import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

const supabaseUrl = "https://trnlqsaljwkbvbvmxruv.supabase.co";
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRybmxxc2FsandrYnZidm14cnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4MjIyMjgsImV4cCI6MjAzMjM5ODIyOH0.UZv9v0t_C80PXAA1XBw4gs_1Ct0tc-fmHIVdO5Hysrs";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
