const panels = document.querySelectorAll('.panel');
const navLinks = document.querySelectorAll('.nav-link');
const root = document.documentElement;
const chatLog = document.getElementById('chatLog');
const memoGrid = document.getElementById('memoGrid');
const gameList = document.getElementById('gameList');
const fileList = document.getElementById('fileList');
const themeToggle = document.getElementById('themeToggle');
const themeOptionButtons = document.querySelectorAll('[data-theme-option]');
const rpsStartButton = document.getElementById('rpsStart');
const rpsDisplay = document.getElementById('rpsDisplay');
const rpsEmojiEl = rpsDisplay?.querySelector('.rps-emoji');
const rpsLabelEl = rpsDisplay?.querySelector('.rps-label');
const rpsCountdown = document.getElementById('rpsCountdown');
const rpsResultBox = document.getElementById('rpsResult');
const rpsStatusText = document.getElementById('rpsStatusText');
const rpsPlayerChoice = document.getElementById('rpsPlayerChoice');
const rpsComputerChoice = document.getElementById('rpsComputerChoice');
const rpsButtons = document.querySelectorAll('.rps-btn');

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

const rpsOptions = [
  { id: 'rock', label: '바위', emoji: '✊' },
  { id: 'paper', label: '보', emoji: '✋' },
  { id: 'scissors', label: '가위', emoji: '✌️' },
];

let rpsCycleInterval = null;
let rpsCycleIndex = 0;
let rpsCountdownTimers = [];
let rpsGameActive = false;
let rpsAwaitingResult = false;

function startRpsGame() {
  if (!rpsDisplay) return;
  rpsGameActive = true;
  rpsAwaitingResult = false;
  rpsCycleIndex = 0;
  highlightRpsChoice();
  resetRpsVisuals();
  clearRpsCountdown();
  startRpsCycle();
  setRpsCountdownMessage('애니메이션이 시작됐어요! 원하는 손모양을 고르세요.');
  rpsStatusText.textContent = '선택을 기다리는 중...';
  rpsPlayerChoice.textContent = 'You —';
  rpsComputerChoice.textContent = 'Computer —';
  if (rpsStartButton) {
    rpsStartButton.textContent = '다시 시작!';
  }
}

function startRpsCycle() {
  stopRpsCycle();
  if (!rpsDisplay) return;
  rpsDisplay.classList.add('is-animating');
  updateRpsDisplay(rpsOptions[0]);
  rpsCycleInterval = setInterval(() => {
    const option = rpsOptions[rpsCycleIndex % rpsOptions.length];
    updateRpsDisplay(option);
    rpsCycleIndex += 1;
  }, 300);
}

function stopRpsCycle() {
  if (rpsCycleInterval) {
    clearInterval(rpsCycleInterval);
    rpsCycleInterval = null;
  }
  rpsDisplay?.classList.remove('is-animating');
}

function updateRpsDisplay(option, prefix = '') {
  if (!option || !rpsEmojiEl || !rpsLabelEl) return;
  rpsEmojiEl.textContent = option.emoji;
  rpsLabelEl.textContent = prefix ? `${prefix}: ${option.label}` : option.label;
}

function handleRpsChoice(choiceId) {
  if (!rpsGameActive || rpsAwaitingResult) {
    setRpsCountdownMessage('먼저 가위바위보 시작! 버튼을 눌러주세요.');
    return;
  }
  const selection = rpsOptions.find((opt) => opt.id === choiceId);
  if (!selection) return;
  rpsAwaitingResult = true;
  stopRpsCycle();
  highlightRpsChoice(choiceId);
  rpsStatusText.textContent = `${selection.label}를 선택했어요!`;
  rpsPlayerChoice.textContent = `You — ${selection.label}`;
  runRpsCountdown(() => finalizeRpsRound(selection));
}

function runRpsCountdown(onComplete) {
  clearRpsCountdown();
  const words = ['가위', '바위', '보'];
  words.forEach((word, index) => {
    const timeout = setTimeout(() => {
      rpsCountdown.textContent = word;
      if (index === words.length - 1) {
        setTimeout(() => {
          rpsCountdown.textContent = '';
          onComplete();
        }, 400);
      }
    }, (index + 1) * 1000);
    rpsCountdownTimers.push(timeout);
  });
}

function clearRpsCountdown() {
  if (rpsCountdownTimers.length) {
    rpsCountdownTimers.forEach((timer) => clearTimeout(timer));
    rpsCountdownTimers = [];
  }
  if (rpsCountdown) {
    rpsCountdown.textContent = '';
  }
}

function finalizeRpsRound(userChoice) {
  const computerChoice = getRandomRpsOption();
  updateRpsDisplay(computerChoice, 'Computer');
  rpsComputerChoice.textContent = `Computer — ${computerChoice.label}`;
  const result = getRpsResult(userChoice.id, computerChoice.id);
  applyRpsResultVisuals(result);
  const messages = {
    win: '승리! 완벽한 한 방이었어요.',
    lose: '패배! 다음 판을 노려보세요.',
    draw: '무승부! 기세를 이어가볼까요?',
  };
  rpsStatusText.textContent = messages[result];
  setRpsCountdownMessage(`${userChoice.label} vs ${computerChoice.label}`);
  rpsGameActive = false;
  rpsAwaitingResult = false;
}

function getRandomRpsOption() {
  return rpsOptions[Math.floor(Math.random() * rpsOptions.length)];
}

function getRpsResult(user, computer) {
  if (user === computer) return 'draw';
  if (
    (user === 'rock' && computer === 'scissors') ||
    (user === 'paper' && computer === 'rock') ||
    (user === 'scissors' && computer === 'paper')
  ) {
    return 'win';
  }
  return 'lose';
}

function highlightRpsChoice(choiceId) {
  rpsButtons.forEach((btn) => {
    btn.classList.toggle('is-selected', btn.dataset.choice === choiceId);
  });
}

function applyRpsResultVisuals(result) {
  ['win', 'lose', 'draw'].forEach((state) => {
    rpsResultBox?.classList.remove(state);
    rpsDisplay?.classList.remove(state);
  });
  if (result) {
    rpsResultBox?.classList.add(result);
    rpsDisplay?.classList.add(result);
  }
}

function resetRpsVisuals() {
  applyRpsResultVisuals();
  updateRpsDisplay(rpsOptions[0]);
}

function setRpsCountdownMessage(message) {
  if (rpsCountdown) {
    rpsCountdown.textContent = message;
  }
}

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

rpsStartButton?.addEventListener('click', startRpsGame);
rpsButtons.forEach((btn) => btn.addEventListener('click', () => handleRpsChoice(btn.dataset.choice)));

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
