/*
 * =========================================================
 * J&B LAB 수정 영역
 * =========================================================
 * 1. 비밀번호 변경: PASSWORD의 "0000"을 수정하세요.
 * 2. 링크 추가: 원하는 항목의 url: "" 안에 주소를 넣으세요.
 * 3. 항목 추가: { name: "새 항목", url: "https://..." }를 추가하세요.
 * 4. url을 비워두면 COMING SOON 상태로 표시됩니다.
 */

const PASSWORD = "0000";

const portfolioData = [
  {
    title: "WORK",
    description: "Professional projects and selected works.",
    items: [
      { name: "Weizmann", url: "" },
      { name: "HAYON", url: "" },
      {
        name: "BBH company",
        url: "https://science-lab1.parkjunbum0255.workers.dev/"
      }
    ]
  },
  {
    title: "JOY",
    description: "Things made for the simple pleasure of making.",
    items: [
      { name: "베이킹", url: "" },
      { name: "뜨개질", url: "" },
      { name: "러닝", url: "" }
    ]
  },
  {
    title: "STUDY",
    description: "Notes, tools and experiments for continuous learning.",
    items: [
      { name: "PHYSICS", url: "" },
      { name: "MATH", url: "" },
      { name: "COMPUTING", url: "" },
      { name: "ENGLISH", url: "" }
    ]
  },
  {
    title: "FAITH",
    description: "Records and reflections rooted in faith.",
    items: [
      { name: "SOMANG", url: "" },
      {
        name: "MY FAITH",
        url: "https://petrick0255-create.github.io/bible/"
      }
    ]
  }
];

/* 아래부터는 기능 코드입니다. 일반적인 링크 수정 시 건드릴 필요가 없습니다. */

const AUTH_KEY = "jnb-lab-access-until";
const SESSION_KEY = "jnb-lab-session";
const ONE_DAY = 24 * 60 * 60 * 1000;

const accessScreen = document.querySelector("#accessScreen");
const portfolio = document.querySelector("#portfolio");
const accessForm = document.querySelector("#accessForm");
const passwordInput = document.querySelector("#password");
const rememberInput = document.querySelector("#remember");
const errorMessage = document.querySelector("#errorMessage");
const mainNav = document.querySelector("#mainNav");
const categoryList = document.querySelector("#categoryList");
const categoryTotal = document.querySelector("#categoryTotal");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function validUrl(url) {
  return /^https?:\/\//i.test(url);
}

function buildItem(item, mode) {
  const name = escapeHtml(item.name);

  if (item.url && validUrl(item.url)) {
    return `
      <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
        <span>${name}</span><span aria-hidden="true">↗</span>
      </a>
    `;
  }

  if (mode === "dropdown") {
    return `
      <span class="pending-link">
        <span>${name}</span><small>COMING SOON</small>
      </span>
    `;
  }

  return `<span>${name}</span>`;
}

function renderPortfolio() {
  categoryTotal.textContent =
    `${String(portfolioData.length).padStart(2, "0")} CATEGORIES`;

  mainNav.innerHTML = portfolioData.map((section, index) => `
    <div class="nav-group">
      <button class="nav-trigger" type="button" aria-expanded="false">
        ${escapeHtml(section.title)} <span aria-hidden="true">+</span>
      </button>
      <div class="dropdown">
        <p>${String(index + 1).padStart(2, "0")} / INDEX</p>
        <ul>
          ${section.items.map(item =>
            `<li>${buildItem(item, "dropdown")}</li>`
          ).join("")}
        </ul>
      </div>
    </div>
  `).join("");

  categoryList.innerHTML = portfolioData.map((section, index) => {
    const liveCount = section.items.filter(item =>
      item.url && validUrl(item.url)
    ).length;

    return `
      <article class="category-row">
        <span class="category-number">
          ${String(index + 1).padStart(2, "0")}
        </span>
        <div class="category-title">
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.description)}</p>
        </div>
        <div class="category-links">
          ${section.items.map(item => buildItem(item, "list")).join("")}
        </div>
        <span class="category-count">
          ${String(liveCount).padStart(2, "0")} LIVE
        </span>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".nav-trigger").forEach(button => {
    button.addEventListener("click", () => {
      const group = button.closest(".nav-group");
      const wasOpen = group.classList.contains("is-open");

      document.querySelectorAll(".nav-group").forEach(other => {
        other.classList.remove("is-open");
        other.querySelector(".nav-trigger").setAttribute("aria-expanded", "false");
      });

      if (!wasOpen) {
        group.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", event => {
    if (!event.target.closest(".nav-group")) {
      document.querySelectorAll(".nav-group").forEach(group => {
        group.classList.remove("is-open");
        group.querySelector(".nav-trigger").setAttribute("aria-expanded", "false");
      });
    }
  });
}

function unlockPortfolio() {
  accessScreen.hidden = true;
  portfolio.hidden = false;
}

function hasValidAccess() {
  const accessUntil = Number(localStorage.getItem(AUTH_KEY) || 0);
  const sessionActive = sessionStorage.getItem(SESSION_KEY) === "active";
  return accessUntil > Date.now() || sessionActive;
}

accessForm.addEventListener("submit", event => {
  event.preventDefault();

  if (passwordInput.value !== PASSWORD) {
    errorMessage.textContent = "비밀번호가 일치하지 않습니다.";
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  if (rememberInput.checked) {
    localStorage.setItem(AUTH_KEY, String(Date.now() + ONE_DAY));
  } else {
    sessionStorage.setItem(SESSION_KEY, "active");
  }

  errorMessage.textContent = "";
  unlockPortfolio();
});

passwordInput.addEventListener("input", () => {
  errorMessage.textContent = "";
});

renderPortfolio();

if (hasValidAccess()) {
  unlockPortfolio();
}
