const panels = document.querySelectorAll('.panel');
const navLinks = document.querySelectorAll('.nav-link');
const root = document.documentElement;
const chatLog = document.getElementById('chatLog');
const memoGrid = document.getElementById('memoGrid');
const gameList = document.getElementById('gameList');
const fileList = document.getElementById('fileList');
const themeToggle = document.getElementById('themeToggle');
const themeOptionButtons = document.querySelectorAll('[data-theme-option]');

const chatMessages = [
  { role: 'ai', text: '안녕하세요! 오늘은 어떤 UI를 구상 중인가요?' },
  { role: 'user', text: '다기능 대시보드의 콘셉트를 정리 중이에요.' },
  { role: 'ai', text: '사이드바+탑바 구조로 묶으면 확장성이 좋아요.' },
];

const memos = [
  {
    title: 'AI 챗 UI',
    updated: '오늘 09:24',
    excerpt: '대화 버블, 모델 스위쳐, 프리셋 카드',
    tags: ['chat', 'interaction'],
  },
  {
    title: '파일 업로드',
    updated: '어제 18:12',
    excerpt: 'Dropzone + 업로드 큐 모듈',
    tags: ['files', 'ux'],
  },
  {
    title: 'Mini Game Hub',
    updated: '어제 14:40',
    excerpt: '윷놀이 포함 미니 게임 카드 UI',
    tags: ['play', 'concept'],
  },
];

const games = [
  { name: '윷놀이 클래식', status: 'Wireframe', players: '2-4', mood: '🪵' },
  { name: 'Focus Tiles', status: 'Prototype', players: 'Solo', mood: '🧠' },
  { name: 'Retro Runner', status: 'Idea', players: 'Solo', mood: '🎯' },
];

const files = [
  { name: 'chat-ui.fig', size: '2.1 MB' },
  { name: 'memo-list.json', size: '14 KB' },
  { name: 'mini-game.sketch', size: '4.4 MB' },
];

function showSection(targetId) {
  panels.forEach((panel) => panel.classList.toggle('is-visible', panel.id === targetId));
}

navLinks.forEach((btn) => {
  btn.addEventListener('click', () => {
    navLinks.forEach((link) => link.classList.remove('is-active'));
    btn.classList.add('is-active');
    showSection(btn.dataset.section);
  });
});

function renderChat() {
  chatLog.innerHTML = chatMessages
    .map((msg) => `<div class="chat-bubble ${msg.role}">${msg.text}</div>`)
    .join('');
}

function renderMemos() {
  memoGrid.innerHTML = memos
    .map(
      (memo) => `
      <article class="memo-card">
        <header>
          <strong>${memo.title}</strong>
          <span>${memo.updated}</span>
        </header>
        <p>${memo.excerpt}</p>
        <footer>
          ${memo.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
        </footer>
      </article>`
    )
    .join('');
}

function renderGames() {
  gameList.innerHTML = games
    .map(
      (game) => `
      <article class="game-card" data-game='${JSON.stringify(game)}'>
        <div>
          <strong>${game.mood} ${game.name}</strong>
          <span>${game.status}</span>
        </div>
        <span>${game.players}</span>
      </article>`
    )
    .join('');

  gameList.querySelectorAll('.game-card').forEach((card) => {
    card.addEventListener('click', () => {
      gameList.querySelectorAll('.game-card').forEach((c) => c.classList.remove('is-active'));
      card.classList.add('is-active');
      const data = JSON.parse(card.dataset.game);
      const preview = document.querySelector('.preview-card');
      preview.innerHTML = `
        <div class="preview-graphic">${data.mood}</div>
        <p class="preview-title">${data.name}</p>
        <p class="preview-meta">Status: ${data.status} · Players: ${data.players}</p>
      `;
    });
  });
}

function renderFiles() {
  fileList.innerHTML = files
    .map(
      (file) => `
      <div class="file-row">
        <div>
          <strong>${file.name}</strong>
          <p class="file-meta">Last edited · mock</p>
        </div>
        <span>${file.size}</span>
      </div>`
    )
    .join('');
}

function toggleTheme() {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(next);
}

function applyTheme(theme) {
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    return;
  }
  root.setAttribute('data-theme', theme);
}

function setupThemeControls() {
  themeToggle?.addEventListener('click', toggleTheme);
  themeOptionButtons.forEach((btn) =>
    btn.addEventListener('click', () => applyTheme(btn.dataset.themeOption))
  );
}

renderChat();
renderMemos();
renderGames();
renderFiles();
setupThemeControls();
