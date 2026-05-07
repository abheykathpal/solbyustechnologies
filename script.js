const loader = document.getElementById("loader");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const typingText = document.getElementById("typingText");
const counters = document.querySelectorAll("[data-counter]");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hide"), 900);
});

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

const typingWords = ["Learn Coding", "AI", "Web Development"];
let wordIndex = 0;
let letterIndex = 0;
let deleting = false;

function typeLoop() {
  const word = typingWords[wordIndex];
  if (!deleting) {
    typingText.textContent = word.slice(0, letterIndex + 1);
    letterIndex++;
    if (letterIndex === word.length) {
      deleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }
  } else {
    typingText.textContent = word.slice(0, letterIndex - 1);
    letterIndex--;
    if (letterIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
    }
  }
  setTimeout(typeLoop, deleting ? 70 : 110);
}
typeLoop();

function runCounter(counter) {
  const target = Number(counter.dataset.counter);
  let current = 0;
  const increment = Math.max(1, Math.floor(target / 70));
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      counter.textContent = target.toLocaleString();
      clearInterval(timer);
      return;
    }
    counter.textContent = current.toLocaleString();
  }, 20);
}

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

counters.forEach((counter) => counterObserver.observe(counter));

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 86%",
      },
    });
  });

  gsap.to(".hero-visual", {
    y: -20,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  gsap.to(".bg-grid", {
    backgroundPosition: "0 120px",
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });
}

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  const count = Math.max(40, Math.floor(window.innerWidth / 28));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.6,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(44, 196, 255, 0.85)";
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 212, 77, ${0.16 - dist / 900})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}

resizeCanvas();
createParticles();
drawParticles();

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

function setError(id, message) {
  document.getElementById(id).textContent = message;
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  setError("nameError", "");
  setError("emailError", "");
  setError("messageError", "");

  let valid = true;
  if (name.length < 2) {
    setError("nameError", "Please enter your name.");
    valid = false;
  }
  if (!emailRegex.test(email)) {
    setError("emailError", "Please enter a valid email.");
    valid = false;
  }
  if (message.length < 10) {
    setError("messageError", "Message should be at least 10 characters.");
    valid = false;
  }

  if (!valid) return;

  formStatus.textContent = "Thanks! Your message has been received.";
  contactForm.reset();
});
