/* ================= POPUP BASE ================= */

function popupTemp(popupType, data) {
  const bodyTemp = {
    followup: followUpPopupTemp,
    status: statusPopupTemp,
  };

  return `<div id="popup-content">
      <div class="head">
          <h4>${popupType.toUpperCase()}</h4>
          <i onclick="closePopup(event)" class="icofont-close"></i>
      </div>
      ${bodyTemp[popupType](data)}
  </div>`;
}

function followUpPopupTemp({ _id = "" }) {
  return `
    <form id="add-followup">
      <div class="input">
        <label>Add Follow-up</label>
        <textarea name="message" placeholder="Enter follow-up..." required></textarea>
      </div>

      <input type="hidden" name="_id" value="${_id}" />

      <button>Add</button>
    </form>
  `;
}

function statusPopupTemp({ _id = "", status = "pending" }) {
  return `
    <form id="update-status">

      <div class="input">
        <label>Status</label>
        <select name="status">
          <option value="pending" ${status === "pending" ? "selected" : ""}>Pending</option>
          <option value="in-progress" ${status === "in-progress" ? "selected" : ""}>In Progress</option>
          <option value="converted" ${status === "converted" ? "selected" : ""}>Converted</option>
          <option value="rejected" ${status === "rejected" ? "selected" : ""}>Rejected</option>
        </select>
      </div>

      <input type="hidden" name="_id" value="${_id}" />

      <button>Update</button>
    </form>
  `;
}

function leadTemp(lead) {
  return `
  <tr class="lead-row" id="lead_${lead._id}">
    
    <td>
      <div class="lead-user">
        <strong>${lead.name}</strong>

        <span class="lead-school">
          ${lead.school || "-"}
        </span>
      </div>
    </td>

    <td>
      <div class="contact-info">
        <span>${lead.email}</span>
        <span>+91 ${lead.phone || "-"}</span>
      </div>
    </td>

    <td>
      <div class="lead-location">
        <strong>${lead.city || "-"}</strong>

        <span>${lead.state || "-"}</span>
      </div>
    </td>

    <td class="lead-grade">
          Grade ${lead.grade || "-"}
        
       
   
    </td>

     <td class="lead-module">
          ${lead.module || "-"}
        </td>

    <td class="msg">
      ${lead.message || "-"}
    </td>

    <td
      class="status-cell"
      onclick="initStatusPopup('${lead._id}', '${lead.status}')"
    >
      <span class="lead-status ${lead.status}">
        ${lead.status}

        <i class="icofont-ui-edit edit-icon"></i>
      </span>
    </td>

    <td>
      ${formatDate(lead.createdAt)}
    </td>
  </tr>

  ${followUpRowTemp(lead)}
  `;
}



function followUpRowTemp(lead) {
  const followups = lead.followUps?.length
    ? lead.followUps
        .map(
          (f) => `
        <div class="followup">
          <p>${f.message}</p>
          <span>${formatDate(f.createdAt)}</span>
        </div>`
        )
        .join("")
    : `<p class="no-followups">No follow-ups yet</p>`;

  return `
    <tr class="followup-row" id="follow_${lead._id}">
      <td colspan="6">
        <div class="followups">
          ${followups}
        </div>
      </td>
    </tr>
  `;
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // change to false if you want 24h format
  });
}