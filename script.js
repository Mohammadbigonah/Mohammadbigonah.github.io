const header = document.getElementById("siteHeader");
const menuButton = document.getElementById("menuButton");
const primaryNav = document.getElementById("primaryNav");
const progress = document.getElementById("scrollProgress");
const pilotForm = document.getElementById("pilotForm");
const formStatus = document.getElementById("formStatus");

function updateScrollState() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 58);

  if (progress) {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = height > 0 ? `${(window.scrollY / height) * 100}%` : "0";
  }
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

function closeMenu() {
  if (!primaryNav || !menuButton) return;
  primaryNav.classList.remove("open");
  menuButton.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

if (menuButton && primaryNav) {
  menuButton.addEventListener("click", () => {
    const open = primaryNav.classList.toggle("open");
    menuButton.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
}

document.querySelectorAll(".faq-list details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-list details").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

if (pilotForm && formStatus) {
  pilotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!pilotForm.reportValidity()) return;

    const data = new FormData(pilotForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const organization = String(data.get("organization") || "").trim();
    const country = String(data.get("country") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = `BP-CRERE pilot enquiry — ${country} — ${organization}`;
    const body = [
      "Dear Dr. Mohammad Bigonah,",
      "",
      "I would like to discuss a BP-CRERE pilot or technical collaboration.",
      "",
      `Decision challenge: ${message}`,
      "",
      "Contact details",
      `Name: ${name}`,
      `Organization: ${organization}`,
      `Country / region: ${country}`,
      `Work email: ${email}`,
      `Primary interest: ${interest}`,
      "",
      "Please let me know a suitable time for an introductory discussion."
    ].join("\n");

    formStatus.textContent = "Your email application is opening with the pilot message prepared.";
    window.location.href = `mailto:bigonah@stu.hit.edu.cn?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
