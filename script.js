const root = document.documentElement;
const loader = document.querySelector(".loader");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const mouseGlow = document.querySelector(".mouse-glow");
const typingText = document.getElementById("typingText");

window.addEventListener("load", () => {
  loader.classList.add("hide");
  if (window.gsap) {
    gsap.from(".glass-nav", { y: -24, opacity: 0, duration: 0.7, ease: "power3.out" });
  }
});

if (window.lucide) {
  lucide.createIcons();
}

const words = ["Python Full Stack Developer", "Django Developer", "Responsive Web App Builder", "Clean UI/UX Enthusiast"];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const word = words[wordIndex];
  typingText.textContent = deleting ? word.slice(0, charIndex--) : word.slice(0, charIndex++);
  if (!deleting && charIndex > word.length + 8) deleting = true;
  if (deleting && charIndex < 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }
  setTimeout(typeLoop, deleting ? 44 : 76);
}
typeLoop();

document.addEventListener("mousemove", (event) => {
  const x = event.clientX;
  const y = event.clientY;
  if (cursorDot && cursorRing) {
    cursorDot.style.left = `${x}px`;
    cursorDot.style.top = `${y}px`;
    cursorRing.style.left = `${x}px`;
    cursorRing.style.top = `${y}px`;
  }
  if (mouseGlow) {
    mouseGlow.style.setProperty("--mx", `${(x / window.innerWidth) * 100}%`);
    mouseGlow.style.setProperty("--my", `${(y / window.innerHeight) * 100}%`);
  }
});

document.querySelectorAll("a, button, input, textarea").forEach((item) => {
  item.addEventListener("mouseenter", () => cursorRing?.style.setProperty("width", "48px"));
  item.addEventListener("mouseleave", () => cursorRing?.style.setProperty("width", "34px"));
});

const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  const isLight = root.getAttribute("data-theme") === "light";
  root.setAttribute("data-theme", isLight ? "dark" : "light");
  themeToggle.innerHTML = isLight ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
  lucide.createIcons();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll?.(".skill-bar").forEach((bar) => {
      bar.style.setProperty("--level", `${bar.dataset.level}%`);
      bar.classList.add("filled");
    });
    observer.unobserve(entry.target);
  });
}, { threshold: 0.18 });

document.querySelectorAll(".reveal, .skill-card").forEach((element) => observer.observe(element));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const number = entry.target;
    const target = Number(number.dataset.count);
    const suffix = target === 100 ? "%+" : "+";
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 45));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      number.textContent = `${current}${suffix}`;
    }, 28);
    countObserver.unobserve(number);
  });
}, { threshold: 0.4 });

document.querySelectorAll("[data-count]").forEach((number) => countObserver.observe(number));

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -7;
    const rotateY = ((x / rect.width) - 0.5) * 7;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
});

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.querySelector(".hero-section").offsetHeight;
  particles = Array.from({ length: Math.min(95, Math.floor(window.innerWidth / 14)) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    size: Math.random() * 2 + 0.6
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(111, 242, 255, 0.7)";
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const distance = Math.hypot(p.x - q.x, p.y - q.y);
      if (distance < 118) {
        ctx.strokeStyle = `rgba(111, 242, 255, ${0.12 - distance / 1200})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();
window.addEventListener("resize", resizeCanvas);

const testimonials = [
  {
    initials: "AR",
    name: "Anitha R",
    role: "Project Collaborator",
    text: "Gopika brings patience, neat structure, and clear debugging habits to development work. Her screens feel practical and easy to use."
  },
  {
    initials: "VK",
    name: "Vikram K",
    role: "Startup Founder",
    text: "The website delivery was clean, responsive, and business-friendly. She understood the goal and converted it into a polished experience."
  },
  {
    initials: "PM",
    name: "Priya M",
    role: "Client Reviewer",
    text: "Her Django workflow and UI sense made the project feel reliable. The final output was professional and simple for users to navigate."
  }
];

let testimonialIndex = 0;
const testimonialCard = document.getElementById("testimonialCard");

function renderTestimonial() {
  const testimonial = testimonials[testimonialIndex];
  testimonialCard.innerHTML = `
    <div class="avatar">${testimonial.initials}</div>
    <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
    <p>"${testimonial.text}"</p>
    <h3>${testimonial.name}</h3>
    <span>${testimonial.role}</span>
  `;
  if (window.gsap) {
    gsap.fromTo(testimonialCard, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.35 });
  }
}

document.getElementById("prevTestimonial").addEventListener("click", () => {
  testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
  renderTestimonial();
});

document.getElementById("nextTestimonial").addEventListener("click", () => {
  testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  renderTestimonial();
});

setInterval(() => {
  testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  renderTestimonial();
}, 5200);
renderTestimonial();

document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const success = document.getElementById("formSuccess");
  success.classList.add("show");
  event.currentTarget.reset();
  setTimeout(() => success.classList.remove("show"), 4200);
});

document.getElementById("backToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
