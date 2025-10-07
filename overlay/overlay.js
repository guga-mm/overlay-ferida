const socket = io("http://localhost:3001");

const nomeEl = document.getElementById("nome");
const fotoEl = document.getElementById("foto");
const pvEl = document.getElementById("pv");
const pfEl = document.getElementById("pf");

socket.on("statusUpdate", (status) => {
  nomeEl.textContent = status.nome;
  fotoEl.src = status.foto;

  pvEl.innerHTML = "";
  pfEl.innerHTML = "";

  for (let i = 0; i < status.pv.max; i++) {
    let slot = document.createElement("span");
    slot.className = "slot";
    if (i < status.pv.atual) {
      slot.classList.add("filled");
    }
    pvEl.appendChild(slot);
  }

  for (let i = 0; i < status.pf.max; i++) {
    let slot = document.createElement("span");
    slot.className = "slot";
    if (i < status.pf.atual) {
      slot.classList.add("filled");
    }
    pfEl.appendChild(slot);
  }
});
