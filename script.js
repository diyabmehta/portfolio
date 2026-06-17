const body = document.body;
const canvas = document.querySelector("#networkCanvas");
const ctx = canvas.getContext("2d");
const themeToggle = document.querySelector("#themeToggle");
const skillInsight = document.querySelector("#skillInsight");
const skillButtons = document.querySelectorAll(".skill-chip");
const filterButtons = document.querySelectorAll(".filter-button");
const cards = document.querySelectorAll(".project-card");
const detail = document.querySelector("#projectDetail");
const timelineItems = document.querySelectorAll(".timeline-item");
const timelineNote = document.querySelector("#timelineNote");

const skillCopy = {
  sql: "SQL is where I connect data structure to business meaning: joins, CTEs, windows, and clean metric definitions.",
  python: "Python helps me make repeatable workflows, validate inputs, and connect analysis code to real data systems.",
  snowflake: "Snowflake gives me practice with warehouses, schemas, governed identifiers, and cloud data querying.",
  storytelling: "Storytelling is the final mile: assumptions, caveats, recommendations, and a clear reason to act."
};

const projectDetails = [
  {
    title: "Revenue, Retention, and ROAS",
    body: "Modeled five tables and wrote analysis queries for monthly performance, customer LTV, cohort retention, and marketing efficiency.",
    bullets: [
      "Built normalized tables and foreign-key relationships.",
      "Used CTEs, joins, window functions, and conditional aggregation.",
      "Translated raw outputs into a concise presentation story."
    ],
    link: "sql_project/README.md",
    label: "Open project notes"
  },
  {
    title: "Snowflake Sales Pipeline",
    body: "Created a Python CLI that sets up Snowflake resources, inserts sample sales data, and runs a regional revenue summary query.",
    bullets: [
      "Added environment-driven configuration for Snowflake credentials.",
      "Validated database, schema, and warehouse identifiers.",
      "Split setup and query modes for repeatable demos."
    ],
    link: "README.md",
    label: "Open project README"
  },
  {
    title: "Verified Opportunity Tracker",
    body: "Designed a structured tracking workflow for comparing analytics roles and separating verified active postings from stale or unverified listings.",
    bullets: [
      "Prioritized roles by location, relevance, and active apply status.",
      "Separated main leads from needs-review rows.",
      "Kept CSV outputs easy to audit and update."
    ],
    link: "analysis_job_tracker_verified_active_2026-05-28.csv",
    label: "Open tracker CSV"
  }
];

let particles = [];
let animationFrame;

function setTheme(mode) {
  body.classList.toggle("dark", mode === "dark");
  localStorage.setItem("portfolio-theme", mode);
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  buildParticles();
}

function buildParticles() {
  const count = Math.min(58, Math.max(28, Math.floor(window.innerWidth / 28)));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.36,
    vy: (Math.random() - 0.5) * 0.36,
    r: Math.random() * 2 + 1
  }));
}

function drawNetwork() {
  const styles = getComputedStyle(body);
  const accent = styles.getPropertyValue("--accent").trim();
  const accentTwo = styles.getPropertyValue("--accent-2").trim();

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = accentTwo;
  ctx.strokeStyle = accent;

  particles.forEach((point, index) => {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < 0 || point.x > window.innerWidth) point.vx *= -1;
    if (point.y < 0 || point.y > window.innerHeight) point.vy *= -1;

    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    ctx.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const distance = Math.hypot(point.x - other.x, point.y - other.y);
      if (distance < 128) {
        ctx.globalAlpha = (128 - distance) / 560;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  });

  ctx.globalAlpha = 1;
  animationFrame = requestAnimationFrame(drawNetwork);
}

function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((counter) => {
    const target = Number(counter.dataset.count);
    let value = 0;
    const step = Math.max(1, Math.ceil(target / 42));
    const tick = () => {
      value = Math.min(target, value + step);
      counter.textContent = value;
      if (value < target) requestAnimationFrame(tick);
    };
    tick();
  });
}

function updateProject(index) {
  const item = projectDetails[index];
  cards.forEach((card) => card.classList.remove("selected"));
  cards[index].classList.add("selected");

  detail.innerHTML = `
    <p class="eyebrow">Project detail</p>
    <h3>${item.title}</h3>
    <p>${item.body}</p>
    <ul>${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>
    <a href="${item.link}">${item.label}</a>
  `;
}

themeToggle.addEventListener("click", () => {
  const next = body.classList.contains("dark") ? "light" : "dark";
  setTheme(next);
});

skillButtons.forEach((button) => {
  button.addEventListener("click", () => {
    skillButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    skillInsight.textContent = skillCopy[button.dataset.skill];
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    cards.forEach((card) => {
      const isVisible = filter === "all" || card.dataset.tags.includes(filter);
      card.classList.toggle("hidden", !isVisible);
    });
  });
});

cards.forEach((card, index) => {
  card.addEventListener("click", () => updateProject(index));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      updateProject(index);
    }
  });
});

timelineItems.forEach((item) => {
  item.addEventListener("click", () => {
    timelineItems.forEach((button) => button.classList.remove("active"));
    item.classList.add("active");
    timelineNote.textContent = item.dataset.note;
  });
});

window.addEventListener("resize", resizeCanvas);
window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame));

setTheme(localStorage.getItem("portfolio-theme") || "light");
resizeCanvas();
drawNetwork();
animateCounters();
updateProject(0);
