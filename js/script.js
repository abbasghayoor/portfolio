{
  const PROFILE_IMAGE_URL = "assets/images/profile.png";
  const CONTACT_DETAILS = {
    EMAIL: "mailto:abbassgayoor78@gmail.com",
    LINKEDIN_URL: "https://www.linkedin.com/in/ghayoor-abbas-ab565a2b9",
    GITHUB_URL: "https://github.com/abbasghayoor"
  };
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const sections = [...document.querySelectorAll("main section[id]")];
  const backToTop = document.querySelector("#back-to-top");
  const profileImage = document.querySelector(".profile-image");
  const profileFallback = document.querySelector("#profile-fallback");
  const contactForm = document.querySelector("#contact-form");
  const formMessage = document.querySelector("#form-message");
  const toast = document.querySelector("#toast");

  const contactTargets = {
    email: CONTACT_DETAILS.EMAIL,
    linkedin: CONTACT_DETAILS.LINKEDIN_URL,
    github: CONTACT_DETAILS.GITHUB_URL
  };

  document.querySelectorAll("[data-contact]").forEach((link) => {
    link.href = contactTargets[link.dataset.contact];
    if (link.dataset.contact !== "email") {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });

  document.querySelectorAll('.icon-link[aria-label="GitHub profile"], .social-row a[aria-label="GitHub"], .footer-nav a[aria-label="GitHub"]').forEach((link) => { link.href = CONTACT_DETAILS.GITHUB_URL; });
  document.querySelectorAll('.icon-link[aria-label="LinkedIn profile"], .social-row a[aria-label="LinkedIn"], .footer-nav a[aria-label="LinkedIn"]').forEach((link) => { link.href = CONTACT_DETAILS.LINKEDIN_URL; });

  const updateScrollState = () => {
    const scrollTop = window.scrollY;
    header.classList.toggle("scrolled", scrollTop > 25);
    backToTop.classList.toggle("visible", scrollTop > 500);

    let currentSection = "home";
    sections.forEach((section) => {
      if (scrollTop >= section.offsetTop - 170) currentSection = section.id;
    });
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`));
  };

  const closeMenu = () => {
    navMenu?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation menu");
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });
  }

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu?.classList.contains("open")) {
      closeMenu();
      menuToggle?.focus();
    }
  });
  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  if (profileImage) {
    const showProfileFallback = () => {
      profileImage.style.display = "none";
      if (profileFallback) profileFallback.style.display = "grid";
    };

    profileImage.addEventListener("error", () => {
      showProfileFallback();
    });
    if (PROFILE_IMAGE_URL === "PASTE_IMAGE_URL_HERE") {
      showProfileFallback();
    } else {
      profileFallback?.style.setProperty("display", "none");
      profileImage.style.display = "block";
      profileImage.src = PROFILE_IMAGE_URL;
    }
  }

  document.querySelectorAll(".project-preview img").forEach((image) => {
    const fallback = image.parentElement.querySelector(".project-preview-fallback");
    image.addEventListener("error", () => {
      image.style.display = "none";
      fallback.classList.add("is-visible");
    });
    if (image.complete && image.naturalWidth === 0) image.dispatchEvent(new Event("error"));
  });

  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  document.querySelectorAll(".case-study-button").forEach((button) => {
    button.addEventListener("click", () => {
      toast.textContent = `${button.dataset.project} is professional internship work and is not publicly shared.`;
      toast.classList.add("show");
      window.setTimeout(() => toast.classList.remove("show"), 4500);
    });
  });

  document.querySelectorAll("[data-placeholder-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      toast.textContent = "Project link will be available soon.";
      toast.classList.add("show");
      window.setTimeout(() => toast.classList.remove("show"), 3500);
    });
  });

  const cvLink = document.querySelector(".cv-link");
  if (cvLink) {
    cvLink.addEventListener("click", () => {
      cvLink.setAttribute("download", "Ghayoor-Abbas-CV.pdf");
    });
  }

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [...contactForm.querySelectorAll("input, textarea")];
    const missingField = fields.find((field) => !field.value.trim());
    const email = contactForm.querySelector("#email");
    formMessage.classList.remove("error");

    if (missingField) {
      formMessage.textContent = `Please complete the ${missingField.labels[0].textContent.toLowerCase()} field.`;
      formMessage.classList.add("error");
      missingField.focus();
      return;
    }
    if (!email.validity.valid) {
      formMessage.textContent = "Please enter a valid email address.";
      formMessage.classList.add("error");
      email.focus();
      return;
    }
    formMessage.textContent = "Form validated successfully. Connect an email service to enable message delivery.";
    contactForm.reset();
  });
}
