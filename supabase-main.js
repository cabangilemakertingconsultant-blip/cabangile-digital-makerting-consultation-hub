import { supabase } from "./supabase.js";

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;

  const { data, error } = await supabase
    .from("contacts")
    .insert([{ name }]);

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Saved:", data);
  }
});
