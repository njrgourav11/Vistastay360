const rooms = {
  aurora: {
    title: "Aurora Sky Suite",
    subtitle: "Fairmont Hotel · Cirque Room panorama",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Cirque%20Room%20Esther%20Bruton%20Panorama.jpg",
  },
  luna: {
    title: "Luna Garden Loft",
    subtitle: "Cerro Pachón hotel dormitory room panorama",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Cerro%20Pach%C3%B3n%20Dormitory%20Room%20360%20Panorama%20(Pano360%20Room%20Pachon%20Hotel1-CC).jpg",
  },
  ember: {
    title: "Ember Corner Studio",
    subtitle: "Cerro Pachón hotel entrance panorama",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/9d/Cerro_Pach%C3%B3n_Hotel_and_Restaurant_Entrance_360_Panorama_%282022_04_08_Pano360_Pachon_Hotel_Hall-CC%29.jpg",
  },
};

function setupViewer(element, roomKey) {
  const room = rooms[roomKey];
  if (!room) return;
  element.style.backgroundImage = `url("${room.image}")`;
  element.style.backgroundSize = "200% 100%";
  element.style.backgroundPosition = "50% 50%";
  element.dataset.offset = "50";

  let isDragging = false;
  let lastX = 0;

  const onPointerDown = (event) => {
    isDragging = true;
    lastX = event.clientX;
    element.style.cursor = "grabbing";
  };

  const onPointerMove = (event) => {
    if (!isDragging) return;
    const delta = event.clientX - lastX;
    lastX = event.clientX;
    const current = Number.parseFloat(element.dataset.offset || "50");
    const next = Math.min(100, Math.max(0, current - delta * 0.08));
    element.dataset.offset = String(next);
    element.style.backgroundPosition = `${next}% 50%`;
  };

  const onPointerUp = () => {
    isDragging = false;
    element.style.cursor = "grab";
  };

  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("pointermove", onPointerMove);
  element.addEventListener("pointerleave", onPointerUp);
  element.addEventListener("pointerup", onPointerUp);
}

document.querySelectorAll("[data-room]").forEach((viewer) => {
  const roomKey = viewer.dataset.room;
  setupViewer(viewer, roomKey);
});

const modal = document.getElementById("viewerModal");
const modalViewer = document.getElementById("modalViewer");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const closeModalBtn = document.getElementById("closeModal");

function openModal(roomKey) {
  const room = rooms[roomKey];
  if (!room) return;
  modalTitle.textContent = room.title;
  modalSubtitle.textContent = room.subtitle;
  setupViewer(modalViewer, roomKey);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.dataset.open);
  });
});

closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
