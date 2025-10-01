const translations = {
  kk: {
    nav_home: "Басты бет",
    btn_l1: "Lesson 1",
    btn_l2: "Lesson 2",
    btn_results: "Менің нәтижелерім",
    login_google: "Google арқылы кіру",
    logout: "Шығу",
    title: "EasyEnglish — оқу және тәжірибе",
    lead: "EasyEnglish сайтына қош келдіңіз! Мұнда жеңілдетілген мәтіндер мен көп таңдаулы тапсырмалар бар.",
    howto: "<strong>Қалай қолдану керек:</strong><ol><li>Google арқылы кіріңіз (қалауыңызша), сонда прогресс сақталады.</li><li>Сабақты таңдаңыз (Lesson 1 / Lesson 2).</li><li>Мәтінді оқып, сұрақтарға жауап беріңіз.</li><li><em>Check Results</em> батырмасын басыңыз.</li></ol>",
    meta: "EasyEnglish қазақ, орыс және ағылшын тілдерінде қолжетімді. Тілді жоғарыдағы жалаушалар арқылы ауыстырыңыз."
  },
  ru: {
    nav_home: "Главная",
    btn_l1: "Lesson 1",
    btn_l2: "Lesson 2",
    btn_results: "Мои результаты",
    login_google: "Войти через Google",
    logout: "Выйти",
    title: "EasyEnglish — чтение и практика",
    lead: "Добро пожаловать на EasyEnglish! Здесь вы найдёте упрощённые тексты и задания с вариантами ответов.",
    howto: "<strong>Как пользоваться:</strong><ol><li>Войдите через Google (по желанию), чтобы сохранялся прогресс.</li><li>Выберите урок (Lesson 1 / Lesson 2).</li><li>Прочитайте текст и ответьте на вопросы.</li><li>Нажмите <em>Check Results</em>.</li></ol>",
    meta: "EasyEnglish доступен на русском, казахском и английском. Переключите язык кнопками сверху."
  },
  en: {
    nav_home: "Home",
    btn_l1: "Lesson 1",
    btn_l2: "Lesson 2",
    btn_results: "My Results",
    login_google: "Sign in with Google",
    logout: "Logout",
    title: "EasyEnglish — Reading & Practice",
    lead: "Welcome to EasyEnglish! Here you will find simplified texts and multiple-choice tasks.",
    howto: "<strong>How to use:</strong><ol><li>Sign in with Google (optional) to save progress.</li><li>Choose a lesson (Lesson 1 / Lesson 2).</li><li>Read the text and answer questions.</li><li>Click <em>Check Results</em>.</li></ol>",
    meta: "EasyEnglish is available in Kazakh, Russian, and English. Switch languages with the flags above."
  }
};

function setLang(lang) {
  localStorage.setItem("lang", lang);
  applyLang(lang);
  syncFlags(lang);
}

function applyLang(lang) {
  // только index.html переводится
  if (document.querySelector("[data-i18n]")) {
    const dict = translations[lang] || translations["kk"];
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.innerHTML = dict[key];
    });
  }
  syncFlags(lang);
}

function syncFlags(lang) {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.lang === lang) btn.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("lang") || "kk"; // по умолчанию — казахский
  applyLang(saved);
});