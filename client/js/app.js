const query = {
  fields: `title,category,description,createdAt,thumbnail,slug`,
  linkQuery: {
    limit: 6,
    page: 1,
  },
};

const blogsContainer = document.querySelector(".blogs-container");
const paginationContainer = document.querySelector(".pagination");

function blogTemplate(blog) {
  return `
<div class="blog">
<div class="thumbnail">
  <img src=${blog.thumbnail ? blog.thumbnail : "/public/images/blog1.jfif"} />
</div>
<div class="content">
  <h3>${blog.title}</h3>
  <p>
    ${blog.description || "No Description"}
  </p>
  <div class="mini-info">
    <span>${new Date(blog.createdAt).toLocaleDateString()}</span>
    <span>${blog.category?.title}</span>
  </div>
  <a href="${blog.slug}">Read More</a>
</div>
</div>
`;
}

function blogEmptyTemplate(message) {
  return `
    <div class="blog empty">
      <p>${message}</p>
    </div>
  `
}

function buildQuery() {
  if (window.location.search) {
    const searchQuery = new URLSearchParams(window.location.search);
    ["category", "page"].forEach((name) => {
      const value = searchQuery.get(name);
      if (value) {
        query.linkQuery[name] = value;
      }
    });
  }
}

function changePage(pos, defaultPageNumber) {
  if (pos === 0) query.linkQuery.page = defaultPageNumber;
  else {
    //do not move page below 1
    const newPageNumber = Number.parseInt(query.linkQuery.page) + pos;
    if (newPageNumber) {
      query.linkQuery.page = newPageNumber;
    }
  }
  window.location.href = `/?${new URLSearchParams(query.linkQuery).toString()}`;
}

const htmlLinkNode = (pageNumber, text) => {
  const link = document.createElement("a");
  link.innerText = text || pageNumber;
  link.onclick = () => changePage(0, pageNumber);
  return link;
};

function buildPagination() {
  const page = Number.parseInt(query.linkQuery.page);
  //update count
  if (page > 4) {
    paginationContainer.replaceChild(
      htmlLinkNode(page - 1, "..."),
      paginationContainer.children[3]
    );
    paginationContainer.replaceChild(
      htmlLinkNode(page),
      paginationContainer.children[4]
    );
  }
  const index = page > 0 && page < 5 ? page : 4;
  paginationContainer.children[index].classList.add("active");
}

function fetchBlogs() {
  fetch(
    `/api/v1/blogs?${new URLSearchParams({
      fields: query.fields,
      ...query.linkQuery,
    }).toString()}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.status !== "success") throw { message: err.message };

      if (!res.data.blogs.length) throw { message: "No Blogs Found" };

      const blogsTemp = res.data.blogs.map((blog) => {
        return blogTemplate(blog);
      });
      blogsContainer.innerHTML = blogsTemp.join("");
    })
    .catch((err) => {
      blogsContainer.innerHTML = blogEmptyTemplate(err.message);
    });
}

window.addEventListener("DOMContentLoaded", () => {
  buildQuery();
  buildPagination();
  fetchBlogs();
});
