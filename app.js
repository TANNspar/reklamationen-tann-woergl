const API_URL = "https://script.google.com/macros/s/AKfycbx9AyeXjLPbOQg0A1GzIehOr9jeBBInZWK3cYvB_m7bnLMZFIIs3F1zsodA2w9M0fAgsQ/exec";
const ADMIN_PW = "QM-rek";

const filiale = document.getElementById("filiale");
const submitBtn = document.getElementById("submitBtn");
const mhd = document.getElementById("mhd");
const form = document.getElementById("qmForm");
const result = document.getElementById("result");

document.getElementById("adminBtn").onclick = () => {
  const pw = prompt("Passwort:");
  if (pw === ADMIN_PW) {
    sessionStorage.setItem("admin_pw", pw);
    location.href = "admin.html";
  } else if (pw !== null) {
    alert("Falsches Passwort");
  }
};

filiale.addEventListener("input", () => {
  filiale.value = filiale.value.replace(/\D/g, "").slice(0, 4);
  submitBtn.disabled = !/^\d{1,4}$/.test(filiale.value);
});

mhd.addEventListener("input", () => {
  let v = mhd.value.replace(/\D/g, "").slice(0, 8);
  if (v.length > 4) v = v.replace(/(\d{2})(\d{2})(\d+)/, "$1.$2.$3");
  else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, "$1.$2");
  mhd.value = v;
});

form.onsubmit = async (e) => {
  e.preventDefault();

  // Daten einsammeln
  const data = Object.fromEntries(new FormData(form));
  data.rueckruf = !!data.rueckruf;

  // Senden
  const r = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "create", data })
  });

  const j = await r.json();

  if (j.ok) {
    result.textContent = "Gespeichert";

    // Formular wirklich vollständig leeren
    form.reset();

    // Manche Browser behalten Maskenwerte -> explizit leeren
    mhd.value = "";
    filiale.value = "";
    // Button wieder sperren, bis neue Filiale eingegeben wird
    submitbtn.disabled = true;

  } else {
    result.textContent = "Fehler: " + (j.error || "Unbekannt");
  }
};
