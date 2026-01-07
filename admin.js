const API_URL = "https://script.google.com/macros/s/AKfycbyuKLMUrYNtANBspKLQFskzaSn_TnuT1eDzJaGxZhQmW3s1MyUr_bnhGYswZ6hkeveP1w/exec";
const API_URL = "HIER_IHRE_APPS_SCRIPT_WEBAPP_URL";
const pw = sessionStorage.getItem("admin_pw");

if (!pw) {
  alert("Nicht autorisiert");
  location.href = "index.html";
}

async function api(body) {
  const r = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body)
  });
  return r.json();
}

function renderTable(table, rows, isDone) {
  table.innerHTML = `
    <tr>
      <th>✓</th>
      <th>Filiale</th>
      <th>Artikel Nr.</th>
      <th>Chargennummer</th>
      <th>Identnummer</th>
      <th>MHD</th>
      <th>Gewicht</th>
      <th>Code</th>
      <th>Rückruf</th>
      <th>Datum</th>
    </tr>
  `;

  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="checkbox" ${isDone ? "checked" : ""}></td>
      <td>${r.filiale || ""}</td>
      <td>${r.artikel_nr || ""}</td>
      <td>${r.chargennummer || ""}</td>
      <td>${r.identnummer || ""}</td>
      <td>${r.mhd || ""}</td>
      <td>${r.gewicht || ""}</td>
      <td>${r.code || ""}</td>
      <td>${String(r.rueckruf) === "1" ? "Ja" : "Nein"}</td>
      <td>${(r.created_at || "").replace("T", " ").slice(0, 19)}</td>
    `;

    tr.querySelector("input").onchange = async () => {
      await api({
        action: "toggle",
        password: pw,
        id: r.id,
        status: isDone ? "open" : "done"
      });
      load();
    };

    table.appendChild(tr);
  });
}

async function load() {
  const open = await api({ action: "list", password: pw, status: "open" });
  const done = await api({ action: "list", password: pw, status: "done" });

  if (!open.ok) {
    alert("Passwort falsch oder Zugriff verweigert");
    sessionStorage.removeItem("admin_pw");
    location.href = "index.html";
    return;
  }

  renderTable(document.getElementById("openTable"), open.rows, false);
  renderTable(document.getElementById("doneTable"), done.rows, true);
}

load();
