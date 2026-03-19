document.addEventListener("DOMContentLoaded", () => {

  // ===== LOGIN HANDLING =====
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.name);

          window.location.href = "index.html";
        } else {
          showToast(data.message, "error");

        }

      } catch (error) {
        console.error(error);
        alert("Login failed");
      }
    });
  }

});
