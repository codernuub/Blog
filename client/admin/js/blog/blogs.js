const backdrop = document.querySelector(".backdrop");
const blogsEl = document.querySelector(".blogs");
//page state
let state = {
  popupForm: null,
  loaded: null,
  contents: [],
};

function toggleTool(event) {
  console.log(event.composedPath()[2].lastElementChild);
  event.composedPath()[2].lastElementChild.classList.toggle("display-tool");
}

//MANAGE DOM MANIPULATION: "NEED IMPROVEMENT"
function parseTemp(temp) {
  const dom = new DOMParser();
  const doc = dom.parseFromString(temp, "text/html");
  return doc.body.children[0];
}

function renderBlogs(blogs) {
  let listStr = blogs.map((blog) => blogTemp(blog));
  blogsEl.innerHTML = listStr.join("");
}

function customformData(inputs) {
  const data = {};
  inputs.forEach(({ type, name, value, checked }) => {
    if (type === "checkbox") {
      data[name] = checked;
      return;
    }
    if (name) data[name] = value;
  });
  return data;
}

//extract info from targeted element
function getElMetaInfo(el) {
  const info = {
    id: el.target.id,
    index: 0,
  };

  if (!info.id) {
    info.targetedEl = el.composedPath()[1];
    info.id = info.targetedEl.id;
    info.index = Number.parseInt(info.targetedEl.getAttribute("data"));
  } else {
    info.targetedEl = el.target;
  }

  info["parent"] = el.composedPath()[4 - info.index];
  return info;
}

//GOTO PREVIEW
function previewBlog(event) {
  const info = getElMetaInfo(event);
  if (!info.id) return;
  window.location.href = `/${info.id}`;
}

//GOTO EDIT PAGE
function editBlog(event) {
  const info = getElMetaInfo(event);
  if (!info.id) return;
  window.location.href = `/dashboard/blogs/create?blogId=${info.id}`;
}

//OPEN EDIT MODEL
function initBlockBlog(event) {
  const info = getElMetaInfo(event);
  if (!info.id) return;
  openPopup({ target: { id: "block", contentId: info.id } }); //open form popup
  info.parent.children[3].classList.remove("display-tool");
}

//OPEN PUBLISH MODEL
function initPublishBlog(event) {
  const info = getElMetaInfo(event);
  if (!info.id) return;
  openPopup({ target: { id: "publish", contentId: info.id } }); //open form popup
  info.parent.children[3].classList.remove("display-tool");
}

//OPEN DELETE MODEL
function initDeleteBlog(event) {
  const info = getElMetaInfo(event);
  if (!info.id) return;
  openPopup({ target: { id: "delete", contentId: info.id } });
  info.parent.children[3].classList.remove("display-tool");
}

//MANAGE POPUP FORMS : IMPROVED
function openPopup(e) {
  const popupType = e.target.id;
  var popupData = {
    _id: null,
    title: null,
    active: false,
    block: false,
    message: e.target.message,
  };

  //Get Data for Modification Action
  if (["delete", "publish", "block"].includes(popupType)) {
    popupData = state?.contents
      ? state["contents"].find(
          (blog) => blog._id.toString() === e.target.contentId
        )
      : popupData;

    //insert popup form in dom
    backdrop.children[0].innerHTML = popupTemp(popupType, popupData);
    //store popup form in state
    state["popupForm"] = backdrop.children[0].children[0].children[1];
    //attact listener to popup form
    state["popupForm"].addEventListener(
      "submit",
      async (e) => await getFormData(e)
    );
  } else {
    //open alert popup
    backdrop.children[0].innerHTML = messagePopup(popupData);
  }

  //open popup form in dom
  backdrop.classList.add("open-backdrop");
  backdrop.children[0].classList.add("open-popup");
}

function updatePopupButton(msg) {
  state["popupForm"].lastElementChild.textContent = msg;
}

function closePopup() {
  backdrop.classList.toggle("open-backdrop");
  backdrop.children[0].classList.toggle("open-popup");
  backdrop.children[0].innerHTML = "";
  state["popupForm"] = null;
}

//HANDLE FORM SUBMISSION
async function getFormData(e) {
  try {
    e.preventDefault();
    state["loaded"] = false;
    const formType = e.target.id;
    const formdata = customformData([...e.target.elements]); //extract inputs from fields

    //delete category
    if (formType === "delete") {
      updatePopupButton("Deleting...");
      await deleteBlog(formdata);
      return;
    }

    if (formType === "publish") {
      updatePopupButton("In Process...");
      await publishBlog(formdata);
      return;
    }

    if (formType === "block") {
      updatePopupButton("In Process...");
      await blockBlog(formdata);
      return;
    }

    throw { message: "Invalid Action" };
  } catch (err) {
    state["loaded"] = true;
    openPopup({ target: { id: "alert", message: err.message } });
    return;
  }
}

async function publishBlog(data) {
  try {
    const rawRes = await fetch(`/api/v1/blogs/${data._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active: data.active }),
    });
    const res = await rawRes.json();
    if (res.status === "success") {
      //find category
      const index = state["contents"].findIndex(
        (blog) => blog._id.toString() === data._id
      );
      //update blog
      console.log(data.active);
      state["contents"][index]["active"] = JSON.parse(data.active);

      console.log(state.contents[index]);

      blogsEl.replaceChild(
        parseTemp(blogTemp(state["contents"][index])), //new child
        blogsEl.children[index] //old
      );
      openPopup({
        target: {
          id: "alert",
          message: `<strong>${state["contents"][index].title}</strong> blog is ${
            JSON.parse(data.active) ? "published" : "unpublished"
          }`,
        },
      });
      return;
    }
    throw res;
  } catch (err) {
    openPopup({ target: { id: "alert", message: err.message } });
  }
}

async function blockBlog(data) {
  try {
    const rawRes = await fetch(`/api/v1/blogs/${data._id}/block`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await rawRes.json();
    if (res.status === "success") {
      //find category
      const index = state["contents"].findIndex(
        (blog) => blog._id.toString() === data._id
      );
      //update blog
      state["contents"][index]["block"] = res.data.block;

      blogsEl.replaceChild(
        parseTemp(blogTemp(state["contents"][index])), //new child
        blogsEl.children[index] //old
      );
      openPopup({
        target: {
          id: "alert",
          message: `<strong>${state["contents"][index].title}</strong> blog is ${
            res.data.block ? "blocked" : "unblocked"
          }`,
        },
      });
      return;
    }
    throw res;
  } catch (err) {
    openPopup({ target: { id: "alert", message: err.message } });
  }
}

async function deleteBlog(data) {
  try {
    const rawRes = await fetch(`/api/v1/blogs/${data._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const res = await rawRes.json();
    if (res.status === "success") {
      const index = state["contents"].findIndex(
        (blog) => blog._id.toString() === data._id
      );
      state["contents"].map((content) => content.title);
      blogsEl.removeChild(blogsEl.children[index]); //remove from screen
      openPopup({
        target: {
          id: "alert",
          message: `<strong>${state["contents"][index].title}</strong> blog is deleted`,
        },
      });
      return;
    }
    throw res;
  } catch (err) {
    openPopup({ target: { id: "alert", message: err.message } });
  }
}

//Fetch All Categories and render
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const raw = await fetch("/api/v1/blogs", {
      method: "GET",
    });
    const res = await raw.json();

    if (res.status !== "success") {
      throw res;
    }
    state["contents"] = res.data.blogs;
    renderBlogs(res.data.blogs);
  } catch (err) {
    alert(err.message);
  }
});
