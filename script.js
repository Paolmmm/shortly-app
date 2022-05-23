const form = document.querySelector(".form");
const input = form.querySelector(".form__input");
const submitBtn = document.querySelector(".form__btn");
const main = document.querySelector(".main");
const nav = document.querySelector(".nav");
const urlsContainer = document.querySelector(".urls-container");
const startBtn = document.querySelectorAll("[data-start]");
const popUpMenu = document.querySelector(".nav__list");
const urls = JSON.parse(localStorage.getItem("urls")) || [];

submitBtn.addEventListener("click", (e) => {
  if (!form.checkValidity()) {
    form.classList.add("form--invalid");
    return;
  }

  form.classList.remove("form--invalid");
  e.preventDefault();
  const url = input.value;
  input.value = "";
  shorten(url);
});

urlsContainer.addEventListener("click", (e) => {
  if (!e.target.closest("button")) return;

  const url = e.target
    .closest(".history-url")
    .querySelector(".history-url__short").innerText;

  document.querySelectorAll(`[data-copy]`).forEach((data) => {
    data.innerText = data.dataset.copy = "Copy";
  });

  e.target.innerText = e.target.dataset.copy = "Copied!";

  navigator.clipboard.writeText(url);
});

async function shorten(input) {
  try {
    const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${input}`);
    const data = await res.json();
    const shortURL = data.result.full_short_link2;

    check();
    render(input, shortURL);
    save(input, shortURL);
  } catch (err) {
    console.log(err);
  }
}

function check() {
  if (urls.length < 3) return;

  urls.splice(0, 1);
  urlsContainer.children[urlsContainer.children.length - 1].remove();
}

function save(input, shortURL) {
  urls.push({ input, shortURL });
  localStorage.setItem("urls", JSON.stringify(urls));
}

function render(input, shortURL) {
  const html = `
    <div class="history-url">
      <p class="history-url__full">${input}</p>
      <a href="#" class="history-url__short">${shortURL}</a>
      <button class="btn btn--cta history-url__btn" data-copy="Copy">
        Copy
      </button>
    </div>`;
  urlsContainer.insertAdjacentHTML("afterbegin", html);
}

function init() {
  urls.forEach((url) => render(url.input, url.shortURL));

  startBtn.forEach((btn) =>
    btn.addEventListener("click", () =>
      main.scrollIntoView({ behavior: "smooth", block: "center" })
    )
  );

  nav.addEventListener("click", (e) => {
    if (!e.target.closest("li")) return;

    document
      .getElementById(`${e.target.dataset.link}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  const popUpMenuObserver = new IntersectionObserver(
    function (entries) {
      const [entry] = entries;

      if (!entry.isIntersecting)
        document.querySelector("#nav-toggle").checked = false;
    },
    {
      root: null,
      threshold: 0,
    }
  );

  popUpMenuObserver.observe(popUpMenu);
}
init();
