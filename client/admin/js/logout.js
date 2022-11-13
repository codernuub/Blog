document.querySelector(".power").addEventListener("click", async () => {
  try {
    const raw = await fetch("/api/v1/auth/logout", { method: "GET" });
    const res = await raw.json();

    if (res.status !== "success") throw err;

    window.location.href = "/dashboard/login";
  } catch (err) {
    alert(err.message);
  }
});
