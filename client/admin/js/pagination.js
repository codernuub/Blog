const paginationRoot = document.getElementById("ev-pagination");

function renderPageButtons({
  totalCount = 0,
  limit = 10,
  currentPage = 1,
}) {
  if (!paginationRoot) return;

  const totalPages = Math.ceil(totalCount / limit);

  if (totalPages <= 1) {
    paginationRoot.innerHTML = "";
    return;
  }

  const currentUrl = new URL(window.location.href);

  const createPageLink = (page) => {
    const url = new URL(currentUrl);

    url.searchParams.set("page", page);
    url.searchParams.set("limit", limit);

    return `${url.pathname}${url.search}`;
  };

  let html = `
    <div class="ev-pagination">
      <div class="ev-pagination-inner">
  `;

  // PREV BUTTON
  html += `
    <a
      href="${
        currentPage === 1
          ? "javascript:void(0)"
          : createPageLink(currentPage - 1)
      }"
      class="ev-page-btn ${
        currentPage === 1 ? "disabled" : ""
      }"
    >
      <i class="icofont-rounded-left"></i>
    </a>
  `;

  const pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > 3) {
      pages.push("dots-start");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("dots-end");
    }

    pages.push(totalPages);
  }

  pages.forEach((page) => {
    if (typeof page === "string") {
      html += `
        <span class="ev-page-dots">
          ...
        </span>
      `;
      return;
    }

    html += `
      <a
        href="${createPageLink(page)}"
        class="ev-page-btn ${
          currentPage === page ? "active" : ""
        }"
      >
        ${page}
      </a>
    `;
  });

  // NEXT BUTTON
  html += `
    <a
      href="${
        currentPage === totalPages
          ? "javascript:void(0)"
          : createPageLink(currentPage + 1)
      }"
      class="ev-page-btn ${
        currentPage === totalPages ? "disabled" : ""
      }"
    >
      <i class="icofont-rounded-right"></i>
    </a>
  `;

  html += `
      </div>
    </div>
  `;

  paginationRoot.innerHTML = html;
}

window.renderPageButtons = renderPageButtons;