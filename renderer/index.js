const socket = io("http://localhost:3001");

const nomeInput = document.getElementById("nome");
const fotoInput = document.getElementById("foto");
const previewEl = document.getElementById("preview");
const pvAtualEl = document.getElementById("pv-atual");
const pvSlots = pvAtualEl.querySelectorAll("input");
const pvMaxInput = document.getElementById("pv-max");
const pfAtualEl = document.getElementById("pf-atual");
const pfSlots = pfAtualEl.querySelectorAll("input");
const pfMaxInput = document.getElementById("pf-max");

/* socket.on("statusUpdate", (status) => {
  nomeInput.value = status.nome;
  hpInput.value = status.hp;
  manaInput.value = status.mana;
}); */

let fotoData = '';
let pvAtual = 0;
let pfAtual = 0;

const updateStatus = () => {
  console.log("Updating status...");
  window.api.saveData({
    nome: nomeInput.value,
    foto: fotoData,
    pv: {
      max: parseInt(pvMaxInput.value, 10),
      atual: pvAtual
    },
    pf: {
      max: parseInt(pfMaxInput.value, 10),
      atual: pfAtual
    }
  });
  socket.emit("updateStatus");
};

fotoInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      fotoData = reader.result; // Base64
      previewEl.src = fotoData;
      updateStatus();
    };
    reader.readAsDataURL(file);
  }
});

nomeInput.addEventListener("input", () => {
  updateStatus();
});

pvMaxInput.addEventListener("input", () => {
  if (pvMaxInput.value < pvAtual) pvAtual = pvMaxInput.value;
  updatePVBoxes();
  updateStatus();
});

pfMaxInput.addEventListener("input", () => {
  if (pfMaxInput.value < pfAtual) pfAtual = pfMaxInput.value;
  updatePFBoxes();
  updateStatus();
});

(async () => {
  const data = await window.api.loadData();
  if (data.nome) nomeInput.value = data.nome;
  if (data.foto) {
    fotoData = data.foto;
    previewEl.src = fotoData;
  }
  if (data.pv) {
    pvMaxInput.value = data.pv.max || 9;
    pvAtual = data.pv.atual || 0;
  }
  if (data.pf) {
    pfMaxInput.value = data.pf.max || 9;
    pfAtual = data.pf.atual || 0;
  }

  updatePVBoxes();
  updatePFBoxes();
})();

function updatePVBoxes() {
  pvAtualEl.innerHTML = '';
  for (let i = 0; i < pvMaxInput.value; i++) {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    
    checkbox.type = "checkbox";

    if (i < pvAtual) checkbox.checked = true;

    checkbox.addEventListener("change", (e) => {
      if (e.target.checked) pvAtual++;
      else pvAtual--;
      updateStatus();
    });

    label.appendChild(checkbox);
    pvAtualEl.appendChild(label);
  }
}

function updatePFBoxes() {
  pfAtualEl.innerHTML = '';
  for (let i = 0; i < pfMaxInput.value; i++) {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    
    checkbox.type = "checkbox";

    if (i < pfAtual) checkbox.checked = true;

    checkbox.addEventListener("change", (e) => {
      if (e.target.checked) pfAtual++;
      else pfAtual--;
      updateStatus();
    });

    label.appendChild(checkbox);
    pfAtualEl.appendChild(label);
  }
}