import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockSupabase();

// Mock do Supabase para rodar local sem erro
function createMockSupabase(): SupabaseClient {
  const handler = {
    get: (_target: any, prop: string) => {
      if (prop === "from") {
        return (_table: string) => handler.get(_target, "table");
      }

      if (prop === "table") {
        return {
          select: async () => ({ data: [], error: null }),
          insert: async (_data: any) => ({ data: _data, error: null }),
          update: async (_data: any) => ({ data: _data, error: null }),
          delete: async () => ({ data: [], error: null }),
          getPublicUrl: (_path: string) => ({ data: { publicUrl: "" } }),
          upload: async (_path: string, _file: any, _options: any) => ({
            data: null,
            error: null,
          }),
        };
      }

      return (..._args: any) => ({ data: null, error: null });
    },
  };

  return new Proxy({}, handler) as SupabaseClient;
}
