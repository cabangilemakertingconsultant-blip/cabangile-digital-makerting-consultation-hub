// ================================
// SUPABASE ADMIN AUTH MODULE
// ================================

// IMPORTANT: Replace with your real Supabase credentials
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// Create client
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ================================
// LOGIN FUNCTION
// ================================
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  if (!email || !password) {
    msg.innerText = "Please fill all fields";
    return;
  }

  // 1. Authenticate user
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    msg.innerText = error.message;
    return;
  }

  const user = data.user;

  // 2. Get profile (role check)
  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    msg.innerText = "Profile error: " + profileError.message;
    await client.auth.signOut();
    return;
  }

  // 3. ROLE SECURITY CHECK
  if (!profile || profile.role !== "admin") {
    msg.innerText = "Access denied (Admin only)";
    await client.auth.signOut();
    return;
  }

  // 4. SUCCESS LOGIN
  localStorage.setItem("admin", "true");
  localStorage.setItem("user_email", email);

  msg.innerText = "Login successful...";

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 800);
}

// ================================
// SESSION CHECK (AUTO PROTECT)
// ================================
async function checkSession() {
  const { data } = await client.auth.getSession();

  if (!data.session) {
    return false;
  }

  const user = data.session.user;

  const { data: profile } = await client
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    await client.auth.signOut();
    localStorage.removeItem("admin");
    return false;
  }

  localStorage.setItem("admin", "true");
  return true;
}

// ================================
// LOGOUT FUNCTION (GLOBAL USE)
// ================================
async function logout() {
  await client.auth.signOut();
  localStorage.removeItem("admin");
  localStorage.removeItem("user_email");
  window.location.href = "admin.html";
}

// ================================
// AUTO LOGIN REDIRECT
// ================================
(async () => {
  const isAdmin = await checkSession();

  if (isAdmin && window.location.pathname.includes("admin.html")) {
    window.location.href = "dashboard.html";
  }
})();