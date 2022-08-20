const form = document.querySelector(".blog-form");
const img = form.querySelector(".preview-img");
const editor = form.querySelector("#editor");
const buttons = [...form.querySelector(".save-btn").children];

const state = {
  loading: false,
};

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
        data[input.name] = input.value;
    }
  });
  data["content"] = editor.children[0].innerHTML;
  return data;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Clicking");

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
  try {
    await fetch("/api/v1/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
  } catch (err) {
    alert(err.message);
  }

  //reset button
  buttons.forEach((btn) => {
    btn.classList.remove("disable");
    btn.disabled = false;
  });
});

//save
function saveBlog(e) {
  console.log("Save Blog");
  handleFormSubmit(e);
}

//save and publish
function saveAndPublishBlog(e) {
  console.log("Save And Publish Blog");
  handleFormSubmit(e);
}
