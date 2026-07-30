const header = document.getElementById("siteHeader");
const menuButton = document.getElementById("menuButton");
const primaryNav = document.getElementById("primaryNav");
const progress = document.getElementById("scrollProgress");
const messageForm = document.getElementById("messageForm");
const formStatus = document.getElementById("formStatus");

function updateScrollState() {
  header.classList.toggle("scrolled", window.scrollY > 24);
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = height > 0 ? `${(window.scrollY / height) * 100}%` : "0";
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

menuButton.addEventListener("click", () => {
  const open = primaryNav.classList.toggle("open");
  menuButton.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!messageForm.reportValidity()) return;

  const data = new FormData(messageForm);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const topic = String(data.get("topic") || "").trim();
  const message = String(data.get("message") || "").trim();

  const subject = `Research enquiry: ${topic}`;
  const body = [
    `Dear Mohammad Bigonah,`,
    ``,
    message,
    ``,
    `—`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Topic: ${topic}`
  ].join("\n");

  formStatus.textContent = "Your email application is opening with the message prepared.";
  window.location.href = `mailto:bigonah@stu.hit.edu.cn?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
