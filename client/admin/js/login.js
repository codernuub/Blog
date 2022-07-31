const loginEl = document.querySelector("form");

async function login(credentials) {
  try {
    const raw = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const res = await raw.json();

    if (res.status !== "authorized") throw res;

    window.location.href = "/dashboard"; //redirect to dashboard
  } catch (err) {
    alert(err.message);
  }
}

loginEl.addEventListener("submit", async (event) => {
  event.preventDefault();

  const credentials = {
    username: event.target.elements.username.value,
    password: event.target.elements.password.value,
  };

  await login(credentials);
  return null;
});
