// EmailJS settings - replace with your own if you rotate keys in the dashboard
const EMAILJS_PUBLIC_KEY = "ZCF0kUzP2t4A3aMKu";
const EMAILJS_SERVICE_ID = "service_o30jwvl";
const EMAILJS_TEMPLATE_ID = "template_dn9bnl8";

document.addEventListener("DOMContentLoaded", () => {
  attachProfilePopup();
  attachNavToggle();

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    loadEmailJs()
      .then(() => {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        attachContactForm(contactForm);
      })
      .catch((err) =>
        console.error("EmailJS library failed to load:", err)
      );
  }

  // Close resume modal when clicking outside
  window.addEventListener("click", (event) => {
    const preview = document.getElementById("resume-preview");
    if (event.target === preview) {
      closeResumePreview();
    }
  });
});

// ===== PROFILE MENU POPUP =====
function attachProfilePopup() {
  const menuBtn = document.getElementById("profile-chip");
  const profilePopup = document.getElementById("profile-popup");
  if (!menuBtn || !profilePopup) return;

  menuBtn.addEventListener("click", () =>
    profilePopup.classList.toggle("active")
  );

  document.addEventListener("click", (e) => {
    if (!menuBtn.contains(e.target) && !profilePopup.contains(e.target)) {
      profilePopup.classList.remove("active");
    }
  });
}

// ===== NAV TOGGLE (mobile) =====
function attachNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  if (!toggle || !navLinks) return;

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    toggle.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      toggle.classList.remove("open");
    })
  );

  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
      navLinks.classList.remove("open");
      toggle.classList.remove("open");
    }
  });
}

// ===== EMAILJS LOADER =====
function loadEmailJs() {
  return new Promise((resolve, reject) => {
    if (window.emailjs) return resolve();

    const emailJsScript = document.createElement("script");
    emailJsScript.src =
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    emailJsScript.async = true;
    emailJsScript.onload = () => resolve();
    emailJsScript.onerror = () =>
      reject(new Error("EmailJS CDN could not be reached."));

    document.head.appendChild(emailJsScript);
  });
}

// ===== CONTACT FORM HANDLER =====
function attachContactForm(form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    const originalText = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    clearFeedback(form);

    const payload = {
      from_name: form.from_name?.value.trim() || "",
      from_email: form.from_email?.value.trim() || "",
      message: form.message?.value.trim() || "",
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload);
      showFeedback(form, "Message sent successfully!", true);
      form.reset();
    } catch (error) {
      console.error("EmailJS error details:", error);
      showFeedback(
        form,
        "Something went wrong. Please try again or email me directly.",
        false
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}

function clearFeedback(form) {
  const oldMsg = form.querySelector(".form-feedback");
  if (oldMsg) oldMsg.remove();
}

function showFeedback(form, text, success) {
  clearFeedback(form);
  const msg = document.createElement("p");
  msg.className = "form-feedback";
  msg.textContent = text;
  msg.style.color = success ? "green" : "crimson";
  msg.style.fontWeight = "600";
  msg.style.marginTop = "10px";
  form.appendChild(msg);
}

// ===== OPEN RESUME PAGE =====
function openResumePage() {
  window.open("resume.html", "_blank");
}

// ===== RESUME MODAL HANDLING =====
function closeResumePreview() {
  const preview = document.getElementById("resume-preview");
  if (preview) {
    preview.style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scroll
  }
}
