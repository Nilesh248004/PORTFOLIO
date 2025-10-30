// ===== PROFILE MENU POPUP =====
const menuBtn = document.getElementById("menu-btn");
const profilePopup = document.getElementById("profile-popup");

menuBtn.addEventListener("click", () => {
  profilePopup.classList.toggle("active");
});

// Hide popup if clicked outside
document.addEventListener("click", (e) => {
  if (!menuBtn.contains(e.target) && !profilePopup.contains(e.target)) {
    profilePopup.classList.remove("active");
  }
});

// ===== CONTACT FORM & EMAILJS SDK LOAD =====
const emailJsScript = document.createElement("script");
emailJsScript.type = "text/javascript";
emailJsScript.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
document.head.appendChild(emailJsScript);

emailJsScript.onload = function () {
  (function () {
    emailjs.init({
      publicKey: "ZCF0kUzP2t4A3aMKu", // Use your actual public key
    });
  })();

  document
    .getElementById("contact-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      emailjs
        .sendForm("service_q7ljbaj", "template_cuyqd0g", this)
        .then(() => {
          const oldMsg = this.querySelector(".success-message");
          if (oldMsg) oldMsg.remove();

          const successMsg = document.createElement("p");
          successMsg.textContent = "✅ Message sent successfully!";
          successMsg.className = "success-message";
          successMsg.style.color = "green";
          successMsg.style.fontWeight = "600";
          successMsg.style.marginTop = "10px";
          this.appendChild(successMsg);

          this.reset();
        })
        .catch((error) => {
          console.error("❌ EmailJS error details:", error);
          alert("Something went wrong. Please check console for details.");
        });
    });
};

// ===== OPEN RESUME PAGE =====
function openResumePage() {
  // Opens a new page (resume.html) where the PDF is displayed
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

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  const preview = document.getElementById("resume-preview");
  if (event.target === preview) {
    closeResumePreview();
  }
});