import { createClient } from 'https://esm.sh/@supabase/supabase-js'

// Supabase project URL
const supabaseUrl = "https://eycytmebbrdxnpcpirsk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5Y3l0bWViYnJkeG5wY3BpcnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjcwMjcsImV4cCI6MjA5NjI0MzAyN30.M7ODunmegKdu07BlYkge8uwgqCUDxTAS5KgMNuwCAEM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
data.forEach(item => {
  document.body.innerHTML += `
    <video src="${item.video_url}" controls></video>
  `;
});
