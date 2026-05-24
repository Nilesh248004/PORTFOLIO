const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const skillCount = document.querySelector('[data-count="skills"]');
const projectCount = document.querySelector('[data-count="projects"]');
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector(".form-status");
const skillTiles = document.querySelectorAll(".skill-tile");

const emailJsConfig = {
  serviceId: "service_xz409jc",
  templateId: "template_dn9bnl8",
  publicKey: "ZCF0kUzP2t4A3aMKu",
};

if (skillCount) {
  skillCount.textContent = skillTiles.length;
}

if (projectCount) {
  projectCount.textContent = document.querySelectorAll(".project-card").length;
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const isConfigured = Object.values(emailJsConfig).every((value) => !value.startsWith("YOUR_"));

    formStatus.className = "form-status";

    if (!isConfigured) {
      formStatus.classList.add("error");
      formStatus.textContent = "EmailJS is not configured yet. Add your Service ID, Template ID, and Public Key in script.js.";
      return;
    }

    if (!window.emailjs) {
      formStatus.classList.add("error");
      formStatus.textContent = "Email service is still loading. Please try again in a moment.";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    formStatus.textContent = "Sending your message...";

    try {
      await window.emailjs.sendForm(
        emailJsConfig.serviceId,
        emailJsConfig.templateId,
        contactForm,
        { publicKey: emailJsConfig.publicKey }
      );

      formStatus.classList.add("success");
      formStatus.textContent = "Message sent successfully. I will get back to you soon.";
      contactForm.reset();
    } catch (error) {
      formStatus.classList.add("error");
      formStatus.textContent = "Could not send the message. Please check the EmailJS setup and try again.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send Message ->";
    }
  });
}

skillTiles.forEach((tile) => {
  const skillName = tile.querySelector("span")?.textContent?.trim();
  const skillLevel = tile.querySelector("small")?.textContent?.trim();
  const speechText = tile.dataset.speech?.trim();

  if (!skillName || !skillLevel) return;

  tile.setAttribute("role", "button");
  tile.setAttribute("tabindex", "0");
  tile.setAttribute("aria-label", `Play audio for ${skillName}.`);

  const playSkillAudio = () => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      speechText || `${skillName}. My current level is ${skillLevel}.`
    );
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.addEventListener("start", () => tile.classList.add("speaking"));
    utterance.addEventListener("end", () => tile.classList.remove("speaking"));
    utterance.addEventListener("error", () => tile.classList.remove("speaking"));

    window.speechSynthesis.speak(utterance);
  };

  tile.addEventListener("click", playSkillAudio);
  tile.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    playSkillAudio();
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navItems.forEach((item) => {
        item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => observer.observe(section));
