/**
 * @file hangman-core.js
 * @author Oliver Merkel <Merkel(dot)Oliver(at)web(dot)de>
 *
 * @section LICENSE
 *
 * Copyright 2021, Oliver Merkel <Merkel(dot)Oliver(at)web(dot)de>
 * All rights reserved.
 *
 * Released under the MIT license.
 *
 * @section DESCRIPTION
 *
 * Locale independent core of the Hangman game view (Hmi).
 * Implemented in plain vanilla Javascript (no jQuery / Snap.svg),
 * favouring small pure functions for anything that does not
 * inherently require DOM/SVG side effects.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

const PANEL = { x: 320, y: 460 };
const KEYBOARD_TOP = 350;

/* ---------------------------------------------------------------- *
 * Pure helper functions
 * ---------------------------------------------------------------- */

export function pickRandomWord(words) {
  return words[Math.floor(Math.random() * words.length)];
}

export function computeGuessResult(word, guesses) {
  let result = '';
  let incorrect = 0;
  for (const char of word) {
    if (guesses.includes(char.toLowerCase())) {
      result += char;
    } else {
      result += '_';
      incorrect++;
    }
  }
  return { result, incorrect };
}

export function computeBoardSize(panel, availableWidth, availableHeight) {
  return availableWidth / availableHeight < panel.x / panel.y
    ? { x: availableWidth, y: (availableWidth * panel.y) / panel.x }
    : { x: (availableHeight * panel.x) / panel.y, y: availableHeight };
}

export function keyPosition(row, col) {
  return { cx: 15 + 16 * row + 32 * col, cy: KEYBOARD_TOP + row * 30 };
}

/* ---------------------------------------------------------------- *
 * Minimal SVG DOM helpers (replacement for Snap.svg)
 * ---------------------------------------------------------------- */

function setAttrs(el, attrs = {}) {
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  return el;
}

function svgEl(tag, attrs, textContent) {
  const el = document.createElementNS(SVG_NS, tag);
  setAttrs(el, attrs);
  if (textContent !== undefined) {
    el.textContent = textContent;
  }
  return el;
}

/* ---------------------------------------------------------------- *
 * Tabs / accordion widgets (replacement for jQuery UI)
 * ---------------------------------------------------------------- */

export function initTabs(container) {
  const nav = container.querySelector('ul');
  const tabs = Array.from(nav.children);
  const panels = tabs.map((li) =>
    container.querySelector(li.querySelector('a').getAttribute('href'))
  );

  container.classList.add('ui-tabs', 'ui-widget', 'ui-widget-content', 'ui-corner-all');
  nav.classList.add('ui-tabs-nav', 'ui-helper-reset', 'ui-helper-clearfix', 'ui-widget-header', 'ui-corner-all');
  nav.setAttribute('role', 'tablist');

  const activate = (index) => {
    tabs.forEach((li, i) => {
      li.classList.toggle('ui-tabs-active', i === index);
      li.classList.toggle('ui-state-active', i === index);
      panels[i].style.display = i === index ? 'block' : 'none';
    });
  };

  tabs.forEach((li, i) => {
    const anchor = li.querySelector('a');
    li.classList.add('ui-tabs-tab', 'ui-corner-top');
    li.setAttribute('role', 'tab');
    anchor.classList.add('ui-tabs-anchor');
    anchor.setAttribute('role', 'presentation');
    anchor.addEventListener('click', (ev) => {
      ev.preventDefault();
      activate(i);
    });
  });

  panels.forEach((panel) => {
    panel.classList.add('ui-tabs-panel', 'ui-widget-content', 'ui-corner-bottom');
    panel.setAttribute('role', 'tabpanel');
  });

  activate(0);
}

export function initAccordion(container) {
  const headers = Array.from(container.querySelectorAll(':scope > h3'));
  const contents = headers.map((h) => h.nextElementSibling);

  container.classList.add('ui-accordion', 'ui-widget', 'ui-helper-reset');

  const activate = (index) => {
    headers.forEach((header, i) => {
      const isActive = i === index;
      header.classList.toggle('ui-state-active', isActive);
      header.classList.toggle('ui-state-default', !isActive);
      header.setAttribute('aria-expanded', String(isActive));
      contents[i].style.display = isActive ? 'block' : 'none';
    });
  };

  headers.forEach((header, i) => {
    header.classList.add('ui-accordion-header', 'ui-corner-top');
    header.setAttribute('role', 'tab');
    header.addEventListener('click', () => activate(i));
    contents[i].classList.add('ui-accordion-content', 'ui-widget-content', 'ui-corner-bottom');
    contents[i].setAttribute('role', 'tabpanel');
  });

  activate(0);
}

/* ---------------------------------------------------------------- *
 * Game view
 * ---------------------------------------------------------------- */

const GALLOWS_LAYOUT = [
  [{ tag: 'path', attrs: { d: 'M20,300l250,0', fill: 'none', stroke: 'green', 'stroke-width': 20 } }],
  [{ tag: 'path', attrs: { d: 'M50,80l0,220l50,0l-50,-50', fill: 'none', stroke: 'black', 'stroke-width': 10 } }],
  [{ tag: 'path', attrs: { d: 'M110,80l-60,60l0,-60l120,0', fill: 'none', stroke: 'black', 'stroke-width': 8 } }],
  [
    { tag: 'path', attrs: { d: 'M170,80l0,60m-3,-3l6,0m-6,-3l6,0m-6,-3l6,0', fill: 'none', stroke: 'maroon', 'stroke-width': 3, 'stroke-linecap': 'round' } },
    { tag: 'circle', attrs: { cx: 0, cy: 150, r: 10, transform: 'translate(170,0) scale(0.75,1)', fill: 'none', stroke: 'maroon', 'stroke-width': 2 } },
  ],
  [
    { tag: 'circle', attrs: { cx: 170, cy: 140, r: 20, fill: 'orange', stroke: 'black', 'stroke-width': 4 } },
    { tag: 'circle', attrs: { cx: 163, cy: 135, r: 2, fill: 'black', stroke: 'black', 'stroke-width': 4 } },
    { tag: 'circle', attrs: { cx: 177, cy: 135, r: 2, fill: 'black', stroke: 'black', 'stroke-width': 4 } },
    { tag: 'circle', attrs: { cx: 170, cy: 148, r: 4, fill: 'none', stroke: 'black', 'stroke-width': 2 } },
  ],
  [{ tag: 'path', attrs: { d: 'M140,150l30,10l0,32l-30,30l-10,-10', fill: 'none', stroke: 'black', 'stroke-width': 4 } }],
  [
    { tag: 'path', attrs: { d: 'M200,150l-30,10l0,32l30,30l10,-10', fill: 'none', stroke: 'black', 'stroke-width': 4 } },
    { tag: 'circle', attrs: { cx: 170, cy: 140, r: 20, fill: 'lightgreen', stroke: 'black', 'stroke-width': 4 } },
    { tag: 'path', attrs: { d: 'M158,130l10,10m0,-10l-10,10', fill: 'none', stroke: 'black', 'stroke-width': 3 } },
    { tag: 'path', attrs: { d: 'M172,130l10,10m0,-10l-10,10', fill: 'none', stroke: 'black', 'stroke-width': 3 } },
    { tag: 'path', attrs: { d: 'M159,150l25,-6', fill: 'none', stroke: 'black', 'stroke-width': 3 } },
  ],
];

function buildGallows(paper) {
  return GALLOWS_LAYOUT.map((group) =>
    group.map(({ tag, attrs }) => {
      const el = svgEl(tag, attrs);
      paper.appendChild(el);
      return el;
    })
  );
}

function buildKeyboard(paper, keysLayout, onGuess) {
  const keys = [];
  keysLayout.forEach((row, r) => {
    Array.from(row).forEach((letter, i) => {
      const { cx, cy } = keyPosition(r, i);
      const back = svgEl('circle', { cx, cy, r: 14, fill: 'lightblue', stroke: 'white', 'stroke-width': 3 });
      const text = svgEl('text', {
        x: cx, y: cy, 'font-size': 18, 'text-anchor': 'middle', 'dominant-baseline': 'central',
      }, letter);
      const button = svgEl('circle', {
        cx, cy, r: 14, fill: 'white', stroke: 'black', 'stroke-width': 1, 'fill-opacity': 0.01,
        style: 'cursor:pointer',
      });
      paper.appendChild(back);
      paper.appendChild(text);
      paper.appendChild(button);
      button.addEventListener('click', () => onGuess(letter, back));
      keys.push({ back, text, button });
    });
  });
  return keys;
}

export class Hmi {
  constructor({ words, keysLayout, formatHeader, boardId = 'board', headerId = 'myheader', newButtonId = 'new' }) {
    this.words = words;
    this.formatHeader = formatHeader;
    this.word = '';
    this.guesses = '';
    this.falseAttempts = 0;
    this.panel = PANEL;

    this.paper = document.getElementById(boardId);
    this.headerEl = document.getElementById(headerId);
    this.newButtonEl = document.getElementById(newButtonId);

    setAttrs(this.paper, { viewBox: `0 0 ${this.panel.x} ${this.panel.y}` });
    this.paper.appendChild(svgEl('rect', {
      x: 0, y: 0, width: this.panel.x, height: this.panel.y,
      stroke: '#444', 'stroke-width': 0.2, 'stroke-linecap': 'round', fill: 'darkslategrey',
    }));

    this.gallows = buildGallows(this.paper);
    this.keyboard = buildKeyboard(this.paper, keysLayout, (letter, back) => this.guess(letter, back));

    this.resultEl = svgEl('text', {
      x: 160, y: 40, 'font-size': 30, 'text-anchor': 'middle',
      'dominant-baseline': 'central', 'letter-spacing': '3px',
    }, '');
    this.paper.appendChild(this.resultEl);
  }

  guess(letter, back) {
    if (this.guesses.includes(letter)) {
      return;
    }
    this.guesses += letter;
    if (!this.word.toLowerCase().includes(letter)) {
      this.falseAttempts++;
      setAttrs(back, { fill: 'red' });
    } else {
      setAttrs(back, { fill: 'lightgreen' });
    }
    this.update();
  }

  resize() {
    const offsetHeight = 146;
    const offsetWidth = 48;
    const availableWidth = window.innerWidth - offsetWidth;
    const availableHeight = window.innerHeight - offsetHeight;
    const size = computeBoardSize(this.panel, availableWidth, availableHeight);
    setAttrs(this.paper, { width: `${size.x}`, height: `${size.y}` });
    const boardMarginTop = (availableHeight - size.y) / 2;
    this.paper.style.marginTop = `${boardMarginTop}px`;
    const selectMenu = document.getElementById('selectmenu');
    if (selectMenu) {
      selectMenu.style.marginTop = `${boardMarginTop}px`;
    }
    const gamePage = document.getElementById('game-page');
    if (gamePage) {
      gamePage.style.backgroundSize = `auto ${(size.x * 9) / 6}px`;
    }
  }

  initGame() {
    this.falseAttempts = 0;
    this.keyboard.forEach(({ back }) => { setAttrs(back, { fill: 'lightblue' }); });
    this.guesses = '';
    this.word = pickRandomWord(this.words);
    this.update();
  }

  init() {
    this.initGame();
    window.addEventListener('orientationchange', () => this.resize());
    window.addEventListener('resize', () => this.resize());
    this.resize();
    this.update();
    this.newButtonEl.addEventListener('click', () => this.initGame());
  }

  update() {
    const { result } = computeGuessResult(this.word, this.guesses);
    this.resultEl.textContent = result;
    this.headerEl.textContent = this.formatHeader(this.falseAttempts);
    this.gallows.forEach((group, i) => {
      const opacity = i < this.falseAttempts + 1 ? 1 : 0;
      group.forEach((el) => { setAttrs(el, { opacity }); });
    });
  }
}
