import { createClient } from "https://esm.sh/@supabase/supabase-js";

// ================================
// SUPABASE CONFIG
// ================================
const supabaseUrl = "https://eycytmebbrdxnpcpirsk.supabase.co";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

// ================================
// CREATE CLIENT (ONLY ONCE)
// ================================
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ================================
// OPTIONAL: ALIAS (for older code compatibility)
// ================================
export const sb = supabase;

// ================================
// EXAMPLE: FETCH & DISPLAY VIDEOS
// ================================
export async function loadVideos() {
  const { data, error } = await supabase
    .from("videos")
    .select("*");

  if (error) {
    console.error("Error loading videos:", error.message);
    return;
  }

  const container = document.getElementById("videoContainer");

  data.forEach(item => {
    const video = document.createElement("video");
    video.src = item.video_url;
    video.controls = true;
    video.style.width = "300px";
    video.style.margin = "10px";

    container.appendChild(video);
  });
}