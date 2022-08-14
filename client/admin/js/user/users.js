const backdrop = document.querySelector(".backdrop");
const usersEl = document.querySelector(".users");
//page state
let state = {
  popupForm: null,
  loaded: null,
  contents: [],
};

function toggleTool(event) {
  console.log("clicked");
  event.composedPath()[1].children[3].classList.toggle("display-tool");
}

//MANAGE DOM MANIPULATION: "NEED IMPROVEMENT"
function parseTemp(temp) {
  const dom = new DOMParser();
  const doc = dom.parseFromString(temp, "text/html");
  return doc.body.children[0];
}

function renderUsers(users) {
  let listStr = users.map((user) => userTemp(user));
  usersEl.innerHTML = listStr.join("");
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

  console.log(2, info.index, 2 + info.index);
  console.log(el.composedPath());
  info["parent"] = el.composedPath()[2 + info.index];
  return info;
}

//OPEN EDIT MODEL
function initEditUser(event) {
  const info = getElMetaInfo(event);
  if (!info.id) return;
  openPopup({ target: { id: "update", contentId: info.id } }); //open form popup
  console.log(info["parent"]);
  info["parent"].children[2].click(); //close setting popup
}

//OPEN DELETE MODEL
function initDeleteUser(event) {
  const info = getElMetaInfo(event);
  if (!info.id) return;
  openPopup({ target: { id: "delete", contentId: info.id } });
  info["parent"].children[2].click();
}

//MANAGE POPUP FORMS : IMPROVED
function openPopup(e) {
  const popupType = e.target.id;
  var popupData = { _id: null, name: null, username:null, active: false };

  //Get Data for Modification Action
  if (["delete", "suspend", "update"].includes(popupType)) {
    popupData = state?.contents
      ? state["contents"].find(
          (content) => content._id.toString() === e.target.contentId
        )
      : popupData;
  }
  console.log(popupData);
  //insert popup form in dom
  backdrop.children[0].innerHTML = popupTemp(popupType, popupData);
  //store popup form in state
  state["popupForm"] = backdrop.children[0].children[0].children[1];
  //attact listener to popup form
  state["popupForm"].addEventListener(
    "submit",
    async (e) => await getFormData(e)
  );
  //open popup form in dom
  backdrop.classList.toggle("open-backdrop");
  backdrop.children[0].classList.toggle("open-popup");
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
    console.log(formType);
    console.log(formdata);

    //add category
    if (formType === "create") {
      updatePopupButton("Creating..");
      await createUser(formdata);
      closePopup();
      return;
    }

    //delete category
    if (formType === "delete") {
      updatePopupButton("Deleting...");
      await deleteUser(formdata);
      closePopup();
      return;
    }

    if (formType === "update") {
      updatePopupButton("Updating");
      await updateUser(formdata);
      closePopup();
      return;
    }

    throw { message: "Invalid Action" };
  } catch (err) {
    state["loaded"] = true;
    alert(err.message);
    //showStatus({ status: "error", message: err.message });
    return;
  }
}

async function createUser(data) {
  try {
    const rawRes = await fetch(`/api/v1/users`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await rawRes.json();
    if (res.status !== "success") throw res;
    state["contents"].push(res.data.user); //update content array
    usersEl.appendChild(parseTemp(userTemp(res.data.user))); //update screen
  } catch (err) {
    alert(err.message);
    //showStatus({ status: "error", message: err.message });
  }
}

async function updateUser(data) {
  try {
    const rawRes = await fetch(`/api/v1/users/${data._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        username: data.username,
        active: data.active,
      }),
    });
    const res = await rawRes.json();
    if (res.status === "success") {
      //find category
      const index = state["contents"].findIndex(
        (content) => content._id.toString() === data._id
      );
      //update category
      state["contents"][index] = {
        ...state["contents"][index],
        ...data,
      };
      usersEl.replaceChild(
        parseTemp(userTemp(state["contents"][index])), //new child
        usersEl.children[index] //old
      );
      return;
    }
    throw res;
  } catch (err) {
    alert(err.message);
    //showStatus({ status: "error", message: err.message });
  }
}

async function deleteUser(data) {
  try {
    const rawRes = await fetch(`/api/v1/users/${data._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const res = await rawRes.json();
    if (res.status === "success") {
      const index = state["contents"].findIndex(
        (content) => content._id.toString() === data._id
      );
      state["contents"].map((content) => content.title);
      usersEl.removeChild(usersEl.children[index]); //remove from screen
      return;
    }
    throw res;
  } catch (err) {
    alert(err.message);
    //showStatus({ status: "error", message: err.message });
  }
}

//Fetch All Categories and render
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const raw = await fetch("/api/v1/users?role=blogger", {
      method: "GET",
    });
    const res = await raw.json();

    if (res.status !== "success") {
      throw res;
    }
    state["contents"] = res.data.users;
    renderUsers(res.data.users);
  } catch (err) {
    alert(err.message);
  }
});
