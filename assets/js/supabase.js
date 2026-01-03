import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Supabase client
export const supabase = createClient(
  "https://xeidegtzbbiuglgmkbsm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlaWRlZ3R6YmJpdWdsZ21rYnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjA5ODYsImV4cCI6MjA4Mjk5Njk4Nn0.x7KraIEBvyYXyFcsPiVE9k2wCNfHIUWW9TgrhK6BBN8"
);
