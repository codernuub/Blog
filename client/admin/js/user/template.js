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
function createPopupTemp() {
  return ` <form id="create">
      <div class="input">
          <label>Enter Name</label>
          <input name="name" /> 
      </div>
      <div class="input">
          <label>Username</label>
          <input name="username" /> 
      </div>
      <div class="input">
          <label>Password</label>
          <input type="password" name="password" /> 
      </div>
      <button>Create</button>
  </form>`;
}

//POPUP UPDATE FORM BODY TEMPLATE
function updatePopupTemp({
  _id = "",
  name = "",
  username = "",
  active = false,
}) {
  return ` <form id="update">
    <div class="input">
       <label>Enter Name</label>
       <input name="name" value="${name}" /> 
    </div>
    <div class="input">
       <label>Username</label>
       <input name="username" value="${username}"/> 
    </div>
    <div class"checkbox">
       <input type="checkbox" name="active" ${active ? "checked" : ""}/> 
      <label>Enabled</label>
    </div>
    <div class="input hide">
      <input name="_id" value="${_id}" readonly/> 
    </div>
    <button>Update</button>
  </form>`;
}

//Delete Temp
function deletePopupTemp({ _id = "", name = "" }) {
  return `<form id="delete">
      <div class="input">
         <p style="color:#333">Do you want to delete <strong style='color:#f380c3'>${name}</strong> ?</p>
      </div>
      <div class="hide">
      <input class="hide" name="_id" value="${_id}"/>
      </div>
      <button style="background-color:orangered">delete</button>
  </form>`;
}

//Template
function userTemp(user) {
  return `<div class="user ${user.active ? "" : "block-user"}" id="user_${
    user._id
  }">
  
  <img src=${
    user.image ? user.image : "/public/images/default-profile.jfif"
  } alt="abdullah" />
  
  <div class="details">
    <h3>${user.name}</h3>
    <div class="meta-info">
      <p><span class="icofont-user"></span>&nbsp;<span>${user.username}</span></p>
      <p><span class="icofont-blogger"></span>&nbsp;<span>${
        user.blog || 0
      } Blogs</span></p>
    </div>
  </div>
  
  <span class="icofont-gear gear" onclick="toggleTool(event)"></span>

  <ul class="tools" id=${user._id}>
    <li id=${user._id} data="1" class="edit" onclick="initEditUser(event)">
      <span class="icofont-ui-edit"></span>&nbsp;<span>Edit</span>
    </li>
    <li id=${user._id} data="1" class="delete" onclick="initDeleteUser(event)">
      <span class="icofont-ui-delete"></span>&nbsp;<span>Remove</span>
    </li>
  </ul>
</div>`;
}
