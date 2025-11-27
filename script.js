// script.js
// Theme Management
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Initialize theme
const savedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");

body.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  const icon =
    theme === "dark"
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>`;
  themeToggle.innerHTML = icon;
}

// Mobile Menu
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");

  const isOpen = mobileMenu.classList.contains("active");
  const icon = isOpen
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>`;
  mobileMenuBtn.innerHTML = icon;
});

// Navigation
const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const targetId = link.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });

      // Close mobile menu
      mobileMenu.classList.remove("active");
      mobileMenuBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>`;
    }
  });
});

// Active section tracking
const sections = document.querySelectorAll("section[id]");

function updateActiveSection() {
  const scrollPosition = window.pageYOffset + 100;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollPosition >= top && scrollPosition < top + height) {
      // Remove active class from all links
      navLinks.forEach((link) => link.classList.remove("active"));

      // Add active class to current section links
      const activeLinks = document.querySelectorAll(`[data-section="${id}"]`);
      activeLinks.forEach((link) => link.classList.add("active"));
    }
  });
}

window.addEventListener("scroll", updateActiveSection);

// Typing Effect
const typingText = document.getElementById("typingText");
const titles = [
  "Frontend Web-Developer",
  "Freelancer",
  "FullStack Developer"
//   "",
//   "Tech Innovator",
];

let currentTitleIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

function typeWriter() {
  const currentTitle = titles[currentTitleIndex];

  if (isDeleting) {
    typingText.textContent = currentTitle.substring(0, currentCharIndex - 1);
    currentCharIndex--;
  } else {
    typingText.textContent = currentTitle.substring(0, currentCharIndex + 1);
    currentCharIndex++;
  }

  let typeSpeed = isDeleting ? 50 : 100;

  if (!isDeleting && currentCharIndex === currentTitle.length) {
    typeSpeed = 2000; // Pause at end
    isDeleting = true;
  } else if (isDeleting && currentCharIndex === 0) {
    isDeleting = false;
    currentTitleIndex = (currentTitleIndex + 1) % titles.length;
    typeSpeed = 500; // Pause before next title
  }

  setTimeout(typeWriter, typeSpeed);
}

// Start typing effect
typeWriter();

// Scroll animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-up");

      // Animate skill bars when about section is visible
      if (entry.target.id === "about") {
        setTimeout(() => {
          animateSkillBars();
        }, 500);
      }
    }
  });
}, observerOptions);

// Observe sections
sections.forEach((section) => {
  observer.observe(section);
});

// Skill bars animation
function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");

  skillBars.forEach((bar, index) => {
    setTimeout(() => {
      const width = bar.getAttribute("data-width");
      bar.style.width = width + "%";
    }, index * 100);
  });
}

// Scroll to top button
const scrollToTopBtn = document.getElementById("scrollToTop");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add("visible");
  } else {
    scrollToTopBtn.classList.remove("visible");
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Contact form
const contactForm = document.getElementById("contactForm");
const submitBtn = contactForm.querySelector('button[type="submit"]');
const submitText = document.getElementById("submitText");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitText.textContent = "Sending...";
  submitBtn.innerHTML = `
                <div style="width: 20px; height: 20px; border: 2px solid white; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 0.5rem;"></div>
                <span>Sending...</span>
            `;

  // Simulate form submission
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Show success message
  alert(
    "Message sent successfully! Thank you for reaching out. I'll get back to you soon."
  );

  // Reset form
  contactForm.reset();
  clearErrors();

  // Reset button
  submitBtn.disabled = false;
  submitText.textContent = "Send Message";
  submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;">
                    <path d="m22 2-7 20-4-9-9-4Z"></path>
                    <path d="M22 2 11 13"></path>
                </svg>
                <span>Send Message</span>
            `;
});

// Add spin animation for loading
const style = document.createElement("style");
style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
document.head.appendChild(style);

function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  let isValid = true;

  clearErrors();

  if (!name) {
    showError("name", "Name is required");
    isValid = false;
  }

  if (!email) {
    showError("email", "Email is required");
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("email", "Please enter a valid email address");
    isValid = false;
  }

  if (!subject) {
    showError("subject", "Subject is required");
    isValid = false;
  }

  if (!message) {
    showError("message", "Message is required");
    isValid = false;
  } else if (message.length < 10) {
    showError("message", "Message must be at least 10 characters long");
    isValid = false;
  }

  return isValid;
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(fieldId + "Error");

  field.classList.add("error");
  errorElement.textContent = message;
}

function clearErrors() {
  const errorElements = document.querySelectorAll(".form-error");
  const inputElements = document.querySelectorAll(
    ".form-input, .form-textarea"
  );

  errorElements.forEach((el) => (el.textContent = ""));
  inputElements.forEach((el) => el.classList.remove("error"));
}

// Clear error on input
const formInputs = document.querySelectorAll(".form-input, .form-textarea");
formInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.classList.contains("error")) {
      input.classList.remove("error");
      const errorElement = document.getElementById(input.id + "Error");
      if (errorElement) {
        errorElement.textContent = "";
      }
    }
  });
});

// Project Modal
const projectData = {
  ecommerce: {
    title: "E-Commerce Platform",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
    description:
      "Built a comprehensive e-commerce platform from scratch using React, Node.js, and PostgreSQL. Features include user authentication, product catalog, shopping cart, payment processing with Stripe, order management, and a complete admin dashboard for inventory management.",
    technologies: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Stripe",
      "Tailwind CSS",
      "Express",
    ],
    features: [
      "User authentication and authorization",
      "Product catalog with search and filtering",
      "Shopping cart and checkout process",
      "Payment integration with Stripe",
      "Order tracking and management",
      "Admin dashboard for inventory",
      "Responsive design for all devices",
      "Real-time inventory updates",
    ],
  },
  dashboard: {
    title: "Analytics Dashboard",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    description:
      "Developed a sophisticated analytics dashboard for tracking business metrics and KPIs. The application features real-time data updates, interactive charts, custom reporting tools, and role-based access control.",
    technologies: [
      "React",
      "D3.js",
      "Python",
      "FastAPI",
      "MongoDB",
      "WebSocket",
    ],
    features: [
      "Real-time data visualization",
      "Interactive charts and graphs",
      "Custom report generation",
      "Role-based access control",
      "Data export capabilities",
      "Mobile-responsive design",
      "Dark/light theme support",
      "Performance optimization",
    ],
  },
  mobile: {
    title: "Social Mobile App",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop",
    description:
      "Created a cross-platform mobile application using React Native with features including user profiles, real-time messaging, photo/video sharing, social feeds, and push notifications.",
    technologies: [
      "React Native",
      "Firebase",
      "Redux",
      "Node.js",
      "Socket.io",
      "Expo",
    ],
    features: [
      "User profiles and authentication",
      "Real-time messaging system",
      "Photo and video sharing",
      "Social media feeds",
      "Push notifications",
      "Offline functionality",
      "Cross-platform compatibility",
      "Smooth animations and transitions",
    ],
  },
};

function openProjectModal(projectId) {
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const project = projectData[projectId];

  if (!project) return;

  modalTitle.textContent = project.title;
  modalBody.innerHTML = `
                <img src="${project.image}" alt="${
    project.title
  }" style="width: 100%; height: 250px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                
                <div style="margin-bottom: 1.5rem;">
                    <p style="color: var(--muted-foreground); line-height: 1.6;">${
                      project.description
                    }</p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="font-weight: 600; margin-bottom: 1rem;">Key Features</h4>
                    <div class="modal-features">
                        ${project.features
                          .map(
                            (feature) => `
                            <div class="modal-feature">${feature}</div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="font-weight: 600; margin-bottom: 1rem;">Technologies Used</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${project.technologies
                          .map(
                            (tech) => `
                            <span class="tech-tag" style="background: var(--muted); color: var(--muted-foreground); padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.875rem;">
                                ${tech}
                            </span>
                        `
                          )
                          .join("")}
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                    <a href="https://demo.com" target="_blank" class="btn btn-hero" style="flex: 1; text-decoration: none;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15,3 21,3 21,9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        Live Demo
                    </a>
                    <a href="https://github.com" target="_blank" class="btn btn-outline" style="flex: 1; text-decoration: none;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 0.5rem;">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
                        </svg>
                        View Code
                    </a>
                </div>
            `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  const modal = document.getElementById("projectModal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Close modal when clicking outside
document.getElementById("projectModal").addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    closeProjectModal();
  }
});

// Download CV function
function downloadCV() {
  // Create a dummy download link
  alert(
    "CV download initiated! In a real implementation, this would download the actual CV file."
  );
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Initialize animations on load
document.addEventListener("DOMContentLoaded", () => {
  // Add initial animation classes
  const heroElements = document.querySelectorAll(
    "#hero .hero-text, #hero .hero-image"
  );
  heroElements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";

    setTimeout(() => {
      el.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, index * 200);
  });
});

