// ================================
// SUPABASE CONFIG
// ================================
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// Create client
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ================================
// PROTECT DASHBOARD (ADMIN ONLY)
// ================================
async function protectAdmin() {
  try {
    const { data: { user } } = await sb.auth.getUser();

    // No user → redirect
    if (!user) {
      window.location.replace("admin.html");
      return;
    }

    // Check role from profiles table
    const { data: profile, error } = await sb
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !profile || profile.role !== "admin") {
      await sb.auth.signOut();
      window.location.replace("admin.html");
      return;
    }

    console.log("Admin access granted");
  } catch (err) {
    console.error("Auth error:", err);
    window.location.replace("admin.html");
  }
}

// Run protection immediately
protectAdmin();

// ================================
// LOGOUT FUNCTION
// ================================
async function logout() {
  try {
    await sb.auth.signOut();
    localStorage.removeItem("admin");
    window.location.href = "admin.html";
  } catch (err) {
    console.error("Logout error:", err);
  }
}

// ================================
// OPTIONAL: AUTO SESSION CHECK
// ================================
async function checkSession() {
  const { data } = await sb.auth.getSession();

  if (!data.session) {
    window.location.replace("admin.html");
    return;
  }

  const user = data.session.user;

  const { data: profile } = await sb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    await sb.auth.signOut();
    window.location.replace("admin.html");
  }
}

// Optional auto-run (extra security layer)
checkSession();