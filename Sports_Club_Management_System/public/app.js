const $ = (id) => document.getElementById(id);
async function request(url, options = {}) {
  const response = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}
function message(id, text, error = false) {
  $(id).textContent = text;
  $(id).classList.toggle("error", error);
}
async function loadMembers() {
  try {
    const members = await request("/api/members");
    $("memberCount").textContent = members.length;
    $("membersTable").innerHTML = members.length ? members.map(m => `
      <tr><td><strong>${escapeHtml(m.name)}</strong></td><td>${escapeHtml(m.email)}</td><td>${escapeHtml(m.phone || "-")}</td><td>${escapeHtml(m.sport)}</td>
      <td><button class="delete" data-delete-member="${m._id}">Remove</button></td></tr>`).join("") :
      '<tr><td colspan="5">No members yet. Add the first member above.</td></tr>';
  } catch (e) { message("memberMessage", e.message, true); }
}
async function loadActivities() {
  try {
    const activities = await request("/api/activities");
    $("activityCount").textContent = activities.length;
    $("activityList").innerHTML = activities.length ? activities.map(a => `
      <article class="activity"><strong>${escapeHtml(a.title)}</strong><p>🏅 ${escapeHtml(a.sport)}</p>
      <p>📅 ${escapeHtml(a.date)} &nbsp; ⏰ ${escapeHtml(a.time)}</p><p>Coach: ${escapeHtml(a.coach || "Not assigned")}</p>
      <button class="delete" data-delete-activity="${a._id}">Remove</button></article>`).join("") :
      "<p>No activities scheduled yet.</p>";
  } catch (e) { message("activityMessage", e.message, true); }
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
$("memberForm").addEventListener("submit", async e => {
  e.preventDefault();
  const body = Object.fromEntries(new FormData(e.target));
  try { await request("/api/members", { method: "POST", body: JSON.stringify(body) }); e.target.reset(); message("memberMessage", "Member added successfully."); await loadMembers(); }
  catch (err) { message("memberMessage", err.message, true); }
});
$("activityForm").addEventListener("submit", async e => {
  e.preventDefault();
  const body = Object.fromEntries(new FormData(e.target));
  try { await request("/api/activities", { method: "POST", body: JSON.stringify(body) }); e.target.reset(); message("activityMessage", "Activity added successfully."); await loadActivities(); }
  catch (err) { message("activityMessage", err.message, true); }
});
document.addEventListener("click", async e => {
  const memberId = e.target.dataset.deleteMember;
  const activityId = e.target.dataset.deleteActivity;
  if (memberId && confirm("Remove this member?")) {
    try { await request(`/api/members/${memberId}`, { method: "DELETE" }); await loadMembers(); }
    catch (err) { message("memberMessage", err.message, true); }
  }
  if (activityId && confirm("Remove this activity?")) {
    try { await request(`/api/activities/${activityId}`, { method: "DELETE" }); await loadActivities(); }
    catch (err) { message("activityMessage", err.message, true); }
  }
});
loadMembers();
loadActivities();