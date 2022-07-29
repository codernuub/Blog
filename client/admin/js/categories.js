const categoriesEl = document.querySelector(".categories");

const categories = [
  { _id: 1, name: "Tips & Tricks", blogs: 20, active: true },
  { _id: 2, name: "Digital Marketing", blogs: 7 },
  { _id: 3, name: "Technical", blogs: 0, active: true },
  { _id: 4, name: "Pyschology", blogs: 10 },
  { _id: 1, name: "Exams Preparations", blogs: 1, active: true },
  { _id: 2, name: "Morning Diet", blogs: 2, active: true },
];

let listStr = categories.map((category,index) => {
  const isDeletable = category.blogs
    ? ""
    : `<li class='info delete'>
    <span class='icofont-ui-delete'></span>
    <label class="info-tip"><span class="icofont-ui-delete"></span>&nbsp;Delete Category</label></span>
  </li>`;

  return ` <div class="category ${category.active ? "" : "block-category"}">
    <div class="head">
      <span class="title">${category.name}</span>
      <div class="info">
        <span class="icofont-blogger"></span>&nbsp;
        <span>${category.blogs}</span>
        <label class="info-tip"><span class="icofont-blogger"></span>&nbsp;${
          category.blogs
        } blogs</label>
      </div>
    </div>
    <ul class="tools">
    <li class="info edit">
              <span class="icofont-ui-edit"></span>
              <label class="info-tip"><span class="icofont-ui-edit"></span>&nbsp;Edit Category</label></span>
            </li>
      ${isDeletable}  
      <li class="info eye">
        <span class="icofont-${category.active ? "eye-blocked" : "eye"}"></span>
        <label class="info-tip"><span class="icofont-${
          category.active ? "eye-blocked" : "eye"
        }"></span>&nbsp;${
    category.active ? "Disable" : "Enable"
  } category</label></span>
      </li>
    </ul>
  </div>`;
});

categoriesEl.innerHTML = listStr.join("");
