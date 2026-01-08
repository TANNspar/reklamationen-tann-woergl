const API_URL = "https://script.google.com/macros/s/AKfycby6lT41Bqv218g80Oies8X2tCZHpG8VAQ9yf5mEl-gFfP8vkiXAiVW9x5p8HarvhTjc/exec";
const ADMIN_PW = "QM-rek";

const filiale = document.getElementById("filiale");
const submitBtn = document.getElementById("submitBtn");
const mhd = document.getElementById("mhd");
const form = document.getElementById("qmForm");
const result = document.getElementById("result");
const filialeError = document.getElementById("filialeError");

document.getElementById("adminBtn").onclick = () => {
  const pw = prompt("Passwort:");
  if (pw === ADMIN_PW) {
    sessionStorage.setItem("admin_pw", pw);
    location.href = "admin.html";
  } else if (pw !== null) {
    alert("Falsches Passwort");
  }
};

// Filialnummer: genau 4 Ziffern, Button erst dann aktiv
filiale.addEventListener("input", () => {
  filiale.value = filiale.value.replace(/\D/g, "").slice(0, 4);
  submitBtn.disabled = !/^\d{4}$/.test(filiale.value);
  // keine Meldung während des Tippens
  filialeError.textContent = "";
});

// MHD Maske TT.MM.JJJJ
mhd.addEventListener("input", () => {
  let v = mhd.value.replace(/\D/g, "").slice(0, 8);
  if (v.length > 4) v = v.replace(/(\d{2})(\d{2})(\d+)/, "$1.$2.$3");
  else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, "$1.$2");
  mhd.value = v;
});

form.onsubmit = async (e) => {
  e.preventDefault();
  result.textContent = "";

  // Meldung nur wenn nicht erfüllt
  if (!/^\d{4}$/.test(filiale.value)) {
    filialeError.textContent = "Bitte eine 4-stellige Filialnummer eingeben.";
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  data.rueckruf = !!data.rueckruf;

  try {
    const r = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "create", data })
    });

    const j = await r.json();

    if (j.ok) {
      result.textContent = "Gespeichert";
      form.reset();
      mhd.value = "";
      filiale.value = "";
      submitBtn.disabled = true;
    } else {
      result.textContent = "Fehler: " + (j.error || "Unbekannt");
    }
  } catch (err) {
    result.textContent = "Fehler: Netzwerk/Endpoint nicht erreichbar.";
  }
};
