/*
 * =========================================================
 * J&B LAB 수정 영역
 * =========================================================
 * 1. 링크 추가: 원하는 항목의 url: "" 안에 주소를 넣으세요.
 * 2. 항목 추가: { name: "새 항목", url: "https://..." }를 추가하세요.
 * 3. url을 비워두면 COMING SOON 상태로 표시됩니다.
 * 4. 우측 바로가기 추가: quickLinkData에
 *    { name: "이름", url: "https://..." } 한 줄을 추가하세요.
 */

/*
 * 우측 바로가기 배너 수정 영역
 * 아래 배열에 같은 형식으로 한 줄을 추가하면 배너가 자동 생성됩니다.
 * mark는 생략해도 되며, 생략하면 이름의 앞 두 글자가 표시됩니다.
 */
const quickLinkData = [
  { name: "Chat GPT", mark: "AI", url: "https://chatgpt.com/" },
  {
    name: "구글 드라이브",
    mark: "GD",
    url: "https://drive.google.com/drive/my-drive?hl=ko"
  },
  {
    name: "스프레드 시트",
    mark: "GS",
    url: "https://docs.google.com/spreadsheets/u/0/"
  },
  { name: "Github", mark: "GH", url: "https://github.com/" }
];

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

const portfolio = document.querySelector("#portfolio");
const authGate = document.querySelector("#authGate");
const authTitle = document.querySelector("#authTitle");
const authMessage = document.querySelector("#authMessage");
const authButton = document.querySelector("#authButton");
const bubbleField = document.querySelector("#bubbleField");
const categoryList = document.querySelector("#categoryList");
const categoryTotal = document.querySelector("#categoryTotal");
const space = document.querySelector(".space");
const quickLinks = document.querySelector("#quickLinks");
let isOwnerAuthenticated = false;

function applyAuthState(state = {}) {
  const ready = Boolean(state.ready);
  isOwnerAuthenticated = Boolean(state.isOwner);

  portfolio.classList.toggle("is-locked", !isOwnerAuthenticated);
  portfolio.setAttribute("aria-disabled", String(!isOwnerAuthenticated));
  document.body.classList.toggle("is-authenticated", isOwnerAuthenticated);

  authTitle.textContent = isOwnerAuthenticated
    ? "OWNER ACCESS"
    : "LOGIN REQUIRED";
  authMessage.textContent = state.message || (
    ready
      ? "본인 Google 계정으로 로그인해야 모든 기능을 사용할 수 있습니다."
      : "Google 로그인 상태를 확인하고 있습니다."
  );
  authButton.textContent = isOwnerAuthenticated
    ? "✓"
    : "G";
  authButton.setAttribute(
    "aria-label",
    isOwnerAuthenticated ? "로그아웃" : "Google 로그인"
  );
  authButton.title = isOwnerAuthenticated ? "로그아웃" : "Google 로그인";
  authButton.disabled = false;
  authGate.classList.toggle("is-signed-in", isOwnerAuthenticated);
}

window.addEventListener("jnb-auth-change", event => {
  applyAuthState(event.detail);
});

authButton.addEventListener("click", () => {
  if (isOwnerAuthenticated) {
    window.jnbAuth?.signOut();
  } else if (window.jnbAuth) {
    window.jnbAuth?.signIn();
  } else {
    authMessage.textContent = "Firebase 로그인을 불러오는 중입니다.";
  }
});

document.addEventListener("click", event => {
  if (isOwnerAuthenticated || event.target.closest("#authGate")) {
    return;
  }

  const clickedControl = event.target.closest("a, button");
  if (!clickedControl) {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();
  authMessage.textContent = "Google 로그인 후 클릭할 수 있습니다.";
  authGate.classList.remove("needs-attention");
  requestAnimationFrame(() => authGate.classList.add("needs-attention"));
  authButton.focus();
}, true);

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

function makeQuickLinkMark(item) {
  const customMark = String(item.mark || "").trim();
  if (customMark) return customMark.slice(0, 3).toUpperCase();

  return String(item.name || "")
    .replace(/\s+/g, "")
    .slice(0, 2)
    .toUpperCase();
}

function renderQuickLinks() {
  quickLinks.innerHTML = quickLinkData
    .filter(item => item.name && validUrl(item.url))
    .map((item, index) => `
      <a class="quick-link" href="${escapeHtml(item.url)}"
         target="_blank" rel="noopener noreferrer"
         title="${escapeHtml(item.name)}"
         aria-label="${escapeHtml(item.name)} 새 탭에서 열기">
        <span class="quick-link-number">${String(index + 1).padStart(2, "0")}</span>
        <strong class="quick-link-mark" aria-hidden="true">${escapeHtml(makeQuickLinkMark(item))}</strong>
        <span class="quick-link-name">${escapeHtml(item.name)}</span>
        <span class="quick-link-arrow" aria-hidden="true">↗</span>
      </a>
    `)
    .join("");
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

renderQuickLinks();
renderPortfolio();
applyAuthState();
