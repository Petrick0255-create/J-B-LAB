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
      { name: "HAYON", url: "https://petrick0255-create.github.io/experiment/index.html" },
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
      { name: "BAKING", url: "" },
      { name: "KNITTING", url: "" },
      { name: "RUNNING", url: "" }
    ]
  },
  {
    title: "STUDY",
    description: "Notes, tools and experiments for continuous learning.",
    items: [
      { name: "PHYSICS", url: "https://petrick0255-create.github.io/study-note-physics/" },
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
const bubbleField = document.querySelector("#bubbleField");
const categoryList = document.querySelector("#categoryList");
const categoryTotal = document.querySelector("#categoryTotal");
const space = document.querySelector(".space");

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

function buildItem(item) {
  const name = escapeHtml(item.name);

  if (item.url && validUrl(item.url)) {
    return `
      <a class="bubble-link" href="${escapeHtml(item.url)}"
         target="_blank" rel="noopener noreferrer">
        <span>${name}</span><span aria-hidden="true">↗</span>
      </a>
    `;
  }

  return `
    <span class="bubble-link pending-link">
      <span>${name}</span><small>SOON</small>
    </span>
  `;
}

function renderPortfolio() {
  bubbleField.innerHTML = portfolioData.map((section, index) => `
    <article class="bubble bubble-${index + 1}" style="--expanded-size: ${Math.max(450, 330 + section.items.length * 50)}px">
      <button class="bubble-trigger" type="button" aria-expanded="false">
        <span class="bubble-number">0${index + 1}</span>
        <strong>${escapeHtml(section.title)}</strong>
        <span class="bubble-plus" aria-hidden="true">+</span>
      </button>
      <div class="bubble-content">
        <p>${escapeHtml(section.description)}</p>
        <div class="bubble-links">
          ${section.items.map(item => buildItem(item)).join("")}
        </div>
      </div>
    </article>
  `).join("");

  categoryTotal.textContent =
    `${String(portfolioData.length).padStart(2, "0")} CATEGORIES`;

  categoryList.innerHTML = portfolioData.map((section, index) => {
    const liveCount = section.items.filter(item =>
      item.url && validUrl(item.url)
    ).length;

    return `
      <article class="category-row">
        <span class="category-number">0${index + 1}</span>
        <div class="category-title">
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.description)}</p>
        </div>
        <div class="category-links">
          ${section.items.map(item => buildItem(item)).join("")}
        </div>
        <span class="category-count">
          ${String(liveCount).padStart(2, "0")} LIVE
        </span>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".bubble-trigger").forEach(button => {
    button.addEventListener("click", () => {
      const bubble = button.closest(".bubble");
      const wasOpen = bubble.classList.contains("is-open");

      document.querySelectorAll(".bubble").forEach(other => {
        other.classList.remove("is-open");
        const otherTrigger = other.querySelector(".bubble-trigger");
        otherTrigger.setAttribute("aria-expanded", "false");
        if (other !== bubble) otherTrigger.blur();
      });

      if (!wasOpen) {
        bubble.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      } else {
        button.blur();
        delete bubbleField.dataset.active;
      }
    });
  });

  document.querySelectorAll(".bubble").forEach((bubble, index) => {
    bubble.addEventListener("mouseenter", () => {
      bubbleField.dataset.active = String(index + 1);
    });
    bubble.addEventListener("mouseleave", () => {
      if (!bubble.classList.contains("is-open")) {
        delete bubbleField.dataset.active;
      }
    });
    bubble.addEventListener("focusin", () => {
      bubbleField.dataset.active = String(index + 1);
    });
    bubble.addEventListener("focusout", event => {
      if (!bubble.contains(event.relatedTarget) &&
          !bubble.classList.contains("is-open")) {
        delete bubbleField.dataset.active;
      }
    });
  });

  document.addEventListener("click", event => {
    if (!event.target.closest(".bubble")) {
      document.querySelectorAll(".bubble").forEach(bubble => {
        bubble.classList.remove("is-open");
        const trigger = bubble.querySelector(".bubble-trigger");
        trigger.setAttribute("aria-expanded", "false");
        trigger.blur();
      });
      delete bubbleField.dataset.active;
    }
  });
}

let dragStartY = null;
let dragDistance = 0;

space.addEventListener("pointerdown", event => {
  if (event.target.closest(".bubble") || event.target.closest("a")) return;
  dragStartY = event.clientY;
  dragDistance = 0;
  space.classList.add("is-dragging");
  space.setPointerCapture(event.pointerId);
});

space.addEventListener("pointermove", event => {
  if (dragStartY === null) return;
  dragDistance = dragStartY - event.clientY;
  if (dragDistance > 0) {
    space.style.setProperty("--drag-progress",
      String(Math.min(dragDistance / 220, 1)));
  }
});

function finishDrag(event) {
  if (dragStartY === null) return;
  space.classList.remove("is-dragging");
  space.style.removeProperty("--drag-progress");

  if (dragDistance > 110) {
    document.querySelector("#index").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  dragStartY = null;
  dragDistance = 0;
  if (space.hasPointerCapture(event.pointerId)) {
    space.releasePointerCapture(event.pointerId);
  }
}

space.addEventListener("pointerup", finishDrag);
space.addEventListener("pointercancel", finishDrag);

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
