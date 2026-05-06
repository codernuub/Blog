/* ================= SELECTORS ================= */

const backdrop = document.querySelector(".backdrop");
const container = document.querySelector(".leads");
const leadsState = container.querySelector("#data-state");
const leadsEl = container.querySelector(".leads-table");

/* ================= STATE ================= */

let state = {
  popupForm: null,
  loaded: null,
  contents: [],
  currentPage: 1,
  limit: 20,
  total: 0,
};

/* ================= UTILS ================= */

function handleState(text) {
  if (text) {
    leadsState.remove();
    leadsEl.remove() 
    container.innerHTML = `<p class="nothing">${text}</p>`;
  } else {
    leadsState.remove();
  }
}

function parseTemp(temp) {
  const dom = new DOMParser();
  const doc = dom.parseFromString(temp, "text/html");
  return doc.body.children[0];
}

function renderLeads(leads) {
  let listStr = leads.map((lead) => leadTemp(lead));
  leadsEl.innerHTML = `<table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Contact</th>
        <th>Message</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>

    <tbody>${listStr.join("")}</tbody> <!-- IMPORTANT -->
  </table>`;
}

function renderLeadCounts(count = 0) {
  const leadCountEl = document.querySelector(".head h3");
  leadCountEl.textContent = `Leads (${count})`;
}

function customformData(inputs) {
  const data = {};
  inputs.forEach(({ type, name, value }) => {
    if (name) data[name] = value;
  });
  return data;
}

/* ================= FOLLOWUP TOGGLE ================= */

function toggleFollowups(id) {
  const row = document.getElementById(`follow_${id}`);
  row.classList.toggle("open");
}

/* ================= POPUP INIT ================= */

function initFollowupPopup(id) {
  openPopup({ target: { id: "followup", contentId: id } });
}

function initStatusPopup(id, status) {
  openPopup({
    target: { id: "status", contentId: id, status },
  });
}

/* ================= POPUP SYSTEM ================= */

function openPopup(e) {
  const popupType = e.target.id;

  let popupData = { _id: null, status: "pending" };

  if (["followup", "status"].includes(popupType)) {
    popupData = state.contents.find(
      (lead) => lead._id.toString() === e.target.contentId,
    );
  }

  backdrop.children[0].innerHTML = popupTemp(popupType, popupData);

  state.popupForm = backdrop.children[0].children[0].children[1];

  state.popupForm.addEventListener("submit", async (e) => await getFormData(e));

  backdrop.classList.toggle("open-backdrop");
  backdrop.children[0].classList.toggle("open-popup");
}

function closePopup() {
  backdrop.classList.toggle("open-backdrop");
  backdrop.children[0].classList.toggle("open-popup");
  backdrop.children[0].innerHTML = "";
  state.popupForm = null;
}

function updatePopupButton(msg) {
  state.popupForm.lastElementChild.textContent = msg;
}

/* ================= FORM HANDLER ================= */

async function getFormData(e) {
  try {
    e.preventDefault();

    const formType = e.target.id;
    const formdata = customformData([...e.target.elements]);

    if (formType === "add-followup") {
      updatePopupButton("Adding...");
      await addFollowUp(formdata);
      closePopup();
      return;
    }

    if (formType === "update-status") {
      updatePopupButton("Updating...");
      await updateStatus(formdata);
      closePopup();
      return;
    }

    throw { message: "Invalid Action" };
  } catch (err) {
    alert(err.message);
  }
}

/* ================= API ACTIONS ================= */

async function addFollowUp(data) {
  try {
    const raw = await fetch(`/api/v1/contacts/${data._id}/follow-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message: data.message }),
    });

    const res = await raw.json();

    if (res.status !== "success") throw res;

    const index = state.contents.findIndex(
      (l) => l._id.toString() === data._id,
    );

    state.contents[index] = res.data.contact;

    rerenderLead(index);
  } catch (err) {
    alert(err.message);
  }
}

async function updateStatus(data) {
  try {
    const raw = await fetch(`/api/v1/contacts/${data._id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: data.status }),
    });

    const res = await raw.json();

    if (res.status !== "success") throw res;

    const index = state.contents.findIndex(
      (l) => l._id.toString() === data._id,
    );

    state.contents[index].status = data.status;

    rerenderLead(index);
  } catch (err) {
    alert(err.message);
  }
}

/* ================= DOM UPDATE ================= */

function rerenderLead(index) {
  const lead = state.contents[index];

  // replace both rows (lead + followup row)
  const leadRow = document.getElementById(`lead_${lead._id}`);
  const followRow = document.getElementById(`follow_${lead._id}`);

  leadRow.outerHTML = leadTemp(lead);
  followRow.outerHTML = followUpRowTemp(lead);
}

/* ================= FETCH ================= */

async function getLeads(page = 1) {
  try {
    state.currentPage = page;

    const url = new URL(window.location.href);

    url.searchParams.set("page", page);
    url.searchParams.set("limit", state.limit);

    const raw = await fetch(
      `/api/v1/contacts${url.search}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const res = await raw.json();

    if (res.status !== "success") {
      throw new Error(res.message);
    }

    state.contents = res.data.contacts;
    state.total = res.total;

    if (!state.contents.length) {
      handleState("No leads found");
    } else {
      handleState();
      renderLeads(state.contents);
      renderPageButtons({
        totalCount: state.total,
        limit: state.limit,
        currentPage: state.currentPage,
      });
    }

    renderLeadCounts(res.total);
  } catch (err) {
    handleState(err.message || "Failed to load leads");
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);

  const page = Number(urlParams.get("page")) || 1;

  await getLeads(page);
});
