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
  element.style.backgroundPosition = "0px 50%";

  let isDragging = false;
  let lastX = 0;
  let positionX = 0;
  let velocity = 0;
  let rafId = null;

  const applyPosition = () => {
    element.style.backgroundPosition = `${positionX}px 50%`;
  };

  const animateInertia = () => {
    if (Math.abs(velocity) < 0.02) {
      velocity = 0;
      rafId = null;
      return;
    }
    positionX += velocity;
    velocity *= 0.92;
    applyPosition();
    rafId = requestAnimationFrame(animateInertia);
  };

  const onPointerDown = (event) => {
    isDragging = true;
    lastX = event.clientX;
    velocity = 0;
    element.style.cursor = "grabbing";
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    element.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isDragging) return;
    const delta = event.clientX - lastX;
    lastX = event.clientX;
    positionX += delta;
    velocity = delta;
    applyPosition();
  };

  const onPointerUp = (event) => {
    isDragging = false;
    element.style.cursor = "grab";
    element.releasePointerCapture(event.pointerId);
    if (!rafId) {
      rafId = requestAnimationFrame(animateInertia);
    }
  };

  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("pointermove", onPointerMove);
  element.addEventListener("pointerup", onPointerUp);
  element.addEventListener("pointercancel", onPointerUp);
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
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
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

const chatWidget = document.getElementById("chatWidget");
const chatToggle = document.getElementById("chatToggle");
const chatPanel = chatWidget?.querySelector(".chat-panel");
const chatClose = document.getElementById("chatClose");
const chatForm = document.getElementById("chatForm");
const chatBody = document.getElementById("chatBody");

const staticResponses = [
  {
    match: "is the room still available ?",
    answer: "Yes, the room is still available.",
  },
  {
    match: "is it single or double bedroom ?",
    answer: "Double Bedroom.",
  },
  {
    match: "what is the price per night ?",
    answer: "The current price for the preferred room is ₹3999 per night.",
  },
];

function addMessage(text, type) {
  if (!chatBody) return;
  const message = document.createElement("div");
  message.className = `chat-message ${type}`;
  message.textContent = text;
  chatBody.appendChild(message);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getStaticReply(question) {
  const normalized = question.trim().toLowerCase();
  const found = staticResponses.find((item) => item.match === normalized);
  return (
    found?.answer ||
    "I can answer questions about availability, bedroom type, and nightly price."
  );
}

function openChat() {
  if (!chatPanel) return;
  chatPanel.classList.add("open");
  chatPanel.setAttribute("aria-hidden", "false");
}

function closeChat() {
  if (!chatPanel) return;
  chatPanel.classList.remove("open");
  chatPanel.setAttribute("aria-hidden", "true");
}

chatToggle?.addEventListener("click", () => {
  if (!chatPanel) return;
  chatPanel.classList.contains("open") ? closeChat() : openChat();
});

chatClose?.addEventListener("click", closeChat);

chatForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = chatForm.querySelector("input");
  if (!input) return;
  const question = input.value;
  if (!question.trim()) return;
  addMessage(question, "user");
  addMessage(getStaticReply(question), "bot");
  input.value = "";
});

document.querySelectorAll("[data-chat-q]").forEach((button) => {
  button.addEventListener("click", () => {
    const question = button.getAttribute("data-chat-q");
    if (!question) return;
    openChat();
    addMessage(question, "user");
    addMessage(getStaticReply(question), "bot");
  });
});
