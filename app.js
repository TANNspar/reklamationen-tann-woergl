const API_URL = "https://script.google.com/macros/s/AKfycbyuKLMUrYNtANBspKLQFskzaSn_TnuT1eDzJaGxZhQmW3s1MyUr_bnhGYswZ6hkeveP1w/exec";
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

form.onsubmit = async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  data.rueckruf = !!data.rueckruf;

  const r = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "create", data })
  });

  const j = await r.json();
  result.textContent = j.ok ? "Gespeichert" : "Fehler";
  form.reset();
  submitBtn.disabled = true;
};
