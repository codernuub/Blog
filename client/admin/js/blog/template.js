function dateFormatter(date) {
  return new Date(date).toLocaleDateString();
}

//Message Temp
function messagePopup(data) {
  return `<div id="popup-content">
  <div class="head alert">
      <h4>${data.message}</h4>
      <i onclick="closePopup(event)" class="icofont-close"></i>
  </div>
</div>`;
}

//POPUP FORM BASE TEMPLATE
function popupTemp(popupType, data) {
  headType = {
    block: "ui-block",
    delete: "trash",
    publish: "globe",
  };

  bodyTemp = {
    block: blockPopupTemp,
    publish: publishPopupTemp,
    delete: deletePopupTemp,
  };

  return `<div id="popup-content">
      <div class="head">
          <h4>${popupType.toUpperCase()}</h4>
          <i onclick="closePopup(event)" class="icofont-close"></i>
      </div>
      ${bodyTemp[popupType](data)}
  </div>`;
}

//Block Temp Child
function blockPopupTemp({ _id = "", title = "", block = false }) {
  return `<form id="block">
      <div class="input">
         <p style="color:#333">Do you want to ${
           block ? "block" : "unblock"
         } <strong style='color:#f380c3'>${title}</strong> Blog?</p>
      </div>
      <div class="hide">
         <input class="hide" name="_id" value="${_id}"/>
      </div>
      <button style="background-color:orangered">${
        block ? "unblock" : "block"
      }</button>
  </form>`;
}

//Delete Temp Child
function deletePopupTemp({ _id = "", title = "" }) {
  return `<form id="delete">
      <div class="input">
         <p style="color:#333">Do you want to delete <strong style='color:#f380c3'>${title}</strong> Blog ?</p>
      </div>
      <div class="hide">
         <input class="hide" name="_id" value="${_id}"/>
      </div>
      <button style="background-color:orangered">delete</button>
  </form>`;
}

//Publish Temp Child
function publishPopupTemp({ _id = "", title = "", active = false }) {
  return `<form id="publish">
      <div class="input">
         <p style="color:#333">Do you want to ${
           active ? "unpublish" : "publish"
         } <strong style='color:#f380c3'>${title}</strong> Blog ?</p>
      </div>
      <div class="hide">
         <input class="hide" name="_id" value="${_id}"/>
      </div>
      <div class="hide">
         <input class="hide" name="active" value="${!active}"/>
      </div>
      <button>${active?"unpublish":"publish"}</button>
  </form>`;
}

//Template
function blogTemp(blog) {
  const isDeletable = false
    ? ""
    : `<li class="delete" data="1" id=${blog._id} onclick="initDeleteBlog(event)">
  <span data="0" class="icofont-ui-delete"></span>&nbsp;<span data="0">Remove</span>
</li>`;

  const isBlockable = false
    ? ""
    : `<li class="block" data="1" id=${blog._id} onclick="initBlockBlog(event)">
<span data="0" class="icofont-ui-block"></span>&nbsp;<span
  style="margin-left: 1.5px" data="0"
  >${blog.block ? "unblock" : "block"}</span>
</li>`;

  return `<div class="blog ${blog.block ? "block-blog" : ""}">
  <div class="thumbnail">
    <img src=${blog.thumbnail || "/public/images/blog1.jfif"} />
  </div>
  <div class="content">
    <div class="head">
      <h3>${blog.title}</h3>
      <i class="icofont-globe ${blog.active ? "published" : "unpublished"}"></i>
    </div>

    <div class="meta-content mc-1">
      <span class="author"
        ><i class="icofont-user-alt-3"></i>&nbsp;${
          blog?.author?.name || ""
        }</span
      >
      <span class="category"
        ><i class="icofont-list"></i>&nbsp;${blog?.category?.title || ""}</span
      >
    </div>
    <div class="meta-content mc-1">
      <span class="time"
        ><i class="icofont-calendar"></i>&nbsp;${dateFormatter(
          blog.createdAt
        )}</span
      >
    </div>
    <p>
      ${blog.description}
    </p>
  </div>
  <span class="gear" onclick="toggleTool(event)">
    <i class="icofont-gear"></i>
  </span>
  <ul class="tools">
    <li class="view" data="1" id="${blog.slug}" onclick="previewBlog(event)">
      <span data="0" class="icofont-eye"></span
      >&nbsp;<span>Preview</span>
    </li>
    <li class="edit" data="1" id="${blog._id}" onclick="editBlog(event)">
      <span data="0" class="icofont-ui-edit"></span>&nbsp;<span
        style="margin-left: 1.5px"
        >Edit</span
      >
    </li>
    <li class="publish" data="1" id=${blog._id} onclick="initPublishBlog(event)">
<span data="0" class="icofont-globe">
</span>&nbsp;<span style="margin-left: 1px" data="0">${
    blog.active ? "unpublish" : "publish"
  }</span>
</li>
    ${isBlockable}
    ${isDeletable}
  </ul>
</div>`;
}
