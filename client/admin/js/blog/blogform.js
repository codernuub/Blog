const backdrop = document.querySelector(".backdrop");
const form = document.querySelector(".blog-form");
const img = form.querySelector(".preview-img");
const selectCategoriesEl = form.querySelector("#categories");
const editor = form.querySelector("#editor");
const buttons = [...form.querySelector(".save-btn").children];

const state = {
  popupForm: null,
  blogId: null,
  thumbnailDataUrl: "",
};

function parseTemp(temp) {
  const dom = new DOMParser();
  const doc = dom.parseFromString(temp, "text/html");
  return doc.body.children[0];
}

function validateLink(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (err) {
    return false;
  }
}

function handleLinkPaste(e) {
  if (validateLink(e.target.value)) {
    img.src = e.target.value;
    console.log("New Image");
  } else {
    img.src = "/public/images/default-thumbnail.jfif";
    console.log("Default Image");
  }
}

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
  state["popupForm"] = null;
}

const thumbnailInput = document.getElementById("thumbnailInput");
const thumbnailError = document.getElementById("thumbnailError");

thumbnailInput.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (!file) return;

  // Validate image size (1MB)
  if (file.size > 1024 * 1024) {
    thumbnailError.style.display = "block";

    thumbnailInput.value = "";

    img.src = "/public/images/default-thumbnail.jfif";

    state["thumbnailDataUrl"] = "";

    return;
  }

  thumbnailError.style.display = "none";

  const reader = new FileReader();

  reader.onload = (event) => {
    const dataUrl = event.target.result;

    img.src = dataUrl;

    state["thumbnailDataUrl"] = dataUrl;
  };

  reader.readAsDataURL(file);
});

function handleLinkPaste(e) {
  if (validateLink(e.target.value)) {
    img.src = e.target.value;
    console.log("New Image");
  } else {
    img.src = "/public/images/default-thumbnail.jfif";
    console.log("Default Image");
  }
}

function extractInputs(inputs) {
  const data = {};

  inputs.forEach((input) => {
    if (!input.name) return;
    switch (input.name) {
      case "title":
        if (!input.value) input.classList.add("error");
        else data[input.name] = input.value;
        break;
      case "category":
        if (input.value === "0") input.classList.add("error");
        else data[input.name] = input.value;
        break;
      case "keywords":
        data[input.name] = input.value.split(",").map((key) => key.trim());
        break;
      default:
        // skip file input
        if (input.type !== "file") {
          data[input.name] = input.value;
        }
    }
  });
  data["thumbnail"] = state["thumbnailDataUrl"] || "";
  data["content"] = editor.children[0].innerHTML;
  return data;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const activeBtn = document.activeElement;
  //extract input
  const data = extractInputs([...e.target.elements]);
  data["publish"] = activeBtn.id !== "0"; //publish blog based on submit button

  //disable all buttons
  buttons.forEach((btn) => {
    btn.classList.add("disable");
    btn.setAttribute("disabled", true);
  });

  //submit blog
  const url = state.blogId ? `/api/v1/blogs/${state.blogId}` : `/api/v1/blogs`;
  try {
    const rawRes = await fetch(url, {
      method: state.blogId ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const res = await rawRes.json();
    if (res.status !== "success") throw res;

    openPopup({
      target: {
        message: `Blog ${data.active ? "published" : "saved"} successfully!`,
      },
    });
  } catch (err) {
    openPopup({ target: { message: err.message } });
  }

  //reset button
  buttons.forEach((btn) => {
    btn.classList.remove("disable");
    btn.disabled = false;
  });
});

window.addEventListener("DOMContentLoaded", async () => {
  //fetch categories
  try {
    const rawRes = await fetch(`/api/v1/categories`, {
      method: "GET",
      credentials: "include",
    });
    const res = await rawRes.json();
    if (res.status !== "success") throw res;

    res.data.categories.forEach((category) => {
      const catTemp = parseTemp(
        `<option value=${category._id}>${category.title}</option>`,
      );
      selectCategoriesEl.appendChild(catTemp);
    });
  } catch (err) {
    openPopup({ target: { message: err.message } });
  }
  //fetch blog details
  state["blogId"] = new URLSearchParams(window.location.search).get("blogId");
  if (state["blogId"]) {
    try {
      const rawRes = await fetch(`/api/v1/blogs/${state["blogId"]}`, {
        method: "GET",
        credentials: "include",
      });
      const res = await rawRes.json();
      if (res.status !== "success") throw res;

      [...form.elements].forEach((field) => {
        if (!field.name) return;
        if (field.name === "keywords") {
          field.value = res.data.blog[field.name]
            ? res.data.blog[field.name].join(", ")
            : "";
          return;
        }
        if (field.name === "thumbnail") {
          if (res.data.blog[field.name]) {
            img.src = res.data.blog[field.name];

            state["thumbnailDataUrl"] = res.data.blog[field.name];
          }

          return;
        }
        field.value = res.data.blog[field.name] || "";
      });
      editor.children[0].innerHTML = res.data.blog.content;
    } catch (err) {
      openPopup({ target: { message: err.message } });
    }
  }
});
