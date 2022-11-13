const backdrop = document.querySelector(".backdrop");

const changeProfileForm = document.querySelector(".chng-profile");
const changePasswordForm = document.querySelector(".chng-pwd");

function openPopup(e) {
  const popupData = {
    message: e.target.message,
  };
  //open alert popup
  backdrop.children[0].innerHTML = messagePopup(popupData);
  //open popup form in dom
  backdrop.classList.add("open-backdrop");
  backdrop.children[0].classList.add("open-popup");
}

function closePopup() {
  backdrop.classList.toggle("open-backdrop");
  backdrop.children[0].classList.toggle("open-popup");
  backdrop.children[0].innerHTML = "";
}

changeProfileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const data = {};
    //Extract input
    [...event.target.elements].forEach((input) => {
      if (!input.name) return;
      data[input.name] = input.value;
    });

    console.log(data);
    if (!data.name || !data.username) {
      throw { message: "Fields cannot be empty!" };
    }

    const rawRes = await fetch(`/api/v1/users/${userId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await rawRes.json();
    if (res.status !== "success") throw res;

    openPopup({
      target: { message: "Profile Update successfully!" },
    });

    window.location.reload();
  } catch (err) {
    openPopup({
      target: { message: err.message },
    });
  }
});

changePasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const data = {};
    //Extract input
    [...event.target.elements].forEach((input) => {
      if (!input.name) return;
      data[input.name] = input.value;
    });

    const rawRes = await fetch(`/api/v1/auth/change-password`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await rawRes.json();
    if (res.status !== "success") throw res;

    openPopup({
      target: { message: "Password changed successfully!" },
    });

    [...event.target.elements].forEach((input) => {
      if (!input.name) return;
      input.value = "";
    });

  } catch (err) {
    openPopup({
      target: { message: err.message },
    });
  }
});
