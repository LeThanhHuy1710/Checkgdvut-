// assets/js/supabase.js

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Supabase client
export const supabase = createClient(
  "https://xeidegtzbbiuglgmkbsm.supabase.co",                 // Project URL
  "sb_publishable_XqJzHKum27HwEEzDhxKAqQ_qdoItx4K"          // Publishable key
);
