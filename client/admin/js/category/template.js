//POPUP FORM BASE TEMPLATE
function popupTemp(popupType, data) {
  headType = {
    create: "ui-add",
    update: "pen",
    delete: "trash",
  };
  bodyTemp = {
    create: createPopupTemp,
    update: updatePopupTemp,
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
//POPUP UPDATE FORM BODY TEMPLATE
function createPopupTemp({ _id = "", title = "" }) {
  return ` <form id="create">
      <div class="input">
          <label>Enter Category Title</label>
          <input name="title" value="${title || ""}" /> 
      </div>
      <div class="checkbox">
          <input type="checkbox" name="active" />
          <label>Enabled<label>
      </div>
      <button>Create</button>
  </form>`;
}

//POPUP UPDATE FORM BODY TEMPLATE
function updatePopupTemp({ _id = "", title = "", active = false }) {
  return ` <form id="update">
      <div class="input">
          <input name="title" value="${title}" /> 
      </div>
      <div class="checkbox">
          <input type="checkbox" name="active" ${active ? "checked" : ""} />
          <label>Enabled<label>
      </div>
      <div class="input hide">
      <input name="_id" value="${_id}" /> 
      </div>
      <button>Update</button>
  </form>`;
}

//Delete Temp
function deletePopupTemp({ _id = "", title = "" }) {
  return `<form id="delete">
      <div class="input">
         <p style="color:#333">Do you want to delete <strong style='color:#f380c3'>${title}</strong> ?</p>
      </div>
      <div class="hide">
         <input class="hide" name="_id" value="${_id}"/>
      </div>
      <button style="background-color:orangered">delete</button>
  </form>`;
}

//Template
function categoryTemp(category) {
  const isDeletable = category.blogs
    ? ""
    : `<li class="delete" data="1" id=${category._id} onclick="initDeleteCategory(event)">
  <span class="icofont-ui-delete"></span>&nbsp;<span>Remove</span>
</li>`;

  return `<div class="category ${
    !category.active ? "block-category" : ""
  }" id=cat_${category._id}>
<div class="head">
  <span class="title">${category.title}</span>
  <span class="blog-info">${category.blogs || 0} Blogs published</span>
</div>
<span class="icofont-gear gear" onclick="toggleTool(event)"></span>
<ul class="tools" id="${category._id}">
  <li class="edit" data="1" id="${category._id}" onclick="initEditCategory(event)">
    <span class="icofont-ui-edit" data="0"></span  data="0">&nbsp;<span>Edit</span>
  </li>
  ${isDeletable}
</ul>
</div>`;
}

/**
 * <li class="eye" data="1" id=${category._id}>
    <span class="icofont-eye-blocked" id=${
      category._id
    }></span>&nbsp;<span>Suspend</span>
  </li>
 */
