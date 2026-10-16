const textInput = document.getElementById("text-input");
const excludeSpaces = document.getElementById("exclude-spaces");
const limitToggle = document.getElementById("limit-toggle");
const limitInput = document.getElementById("character-limit");
const limitWarning = document.getElementById("limit-warning");
const limitWarningText = document.getElementById("limit-warning-text");
const readingTime = document.getElementById("reading-time");

const characterCount = document.getElementById("character-count");
const wordCount = document.getElementById("word-count");
const sentenceCount = document.getElementById("sentence-count");
const noSpaceNote = document.getElementById("no-space-note");

const densityEmpty = document.getElementById("density-empty");
const densityList = document.getElementById("density-list");
const seeMoreButton = document.getElementById("see-more");
const seeMoreText = document.getElementById("see-more-text");

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

const WORDS_PER_MINUTE = 200;
const LETTERS_SHOWN = 5;

let showAllLetters = false;

function formatNumber(number) {
  return String(number).padStart(2, "0");
}

function countCharacters(text) {
  if (excludeSpaces.checked) {
    return text.replace(/\s/g, "").length;
  }
  return text.length;
}

function countWords(text) {
  return text.split(/\s+/).filter((word) => word !== "").length;
}

function countSentences(text) {
  const endings = text.match(/[.!?…]+/g);
  return endings ? endings.length : 0;
}

function getReadingTime(words) {
  if (words === 0) {
    return "0 minute";
  }

  const minutes = Math.round(words / WORDS_PER_MINUTE);

  if (minutes < 1) {
    return "<1 minute";
  }
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

function updateLimitWarning(characters) {
  const limit = Number(limitInput.value);
  const isOverLimit = limitToggle.checked && limit > 0 && characters > limit;

  limitWarning.hidden = !isOverLimit;
  textInput.setAttribute("aria-invalid", isOverLimit);

  if (isOverLimit) {
    limitWarningText.textContent = `Limit reached! Your text exceeds ${limit} characters.`;
  }
}

function getLetterCounts(text) {
  const letters = [...text.toUpperCase()].filter((character) => /[A-Z]/.test(character));
  const counts = {};

  letters.forEach((letter) => {
    counts[letter] = (counts[letter] || 0) + 1;
  });

  const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return { total: letters.length, sortedCounts };
}

function updateLetterDensity(text) {
  const { total, sortedCounts } = getLetterCounts(text);
  const visibleCounts = showAllLetters ? sortedCounts : sortedCounts.slice(0, LETTERS_SHOWN);

  densityList.innerHTML = visibleCounts
    .map(([letter, count]) => {
      const percentage = ((count / total) * 100).toFixed(2);

      return `
        <li class="density-row">
          <span>${letter}</span>
          <span class="density-bar" aria-hidden="true">
            <span class="density-fill" style="width: ${percentage}%"></span>
          </span>
          <span class="density-value">${count} (${percentage}%)</span>
        </li>
      `;
    })
    .join("");

  densityEmpty.hidden = total > 0;
  seeMoreButton.hidden = sortedCounts.length <= LETTERS_SHOWN;
}

function updateStats() {
  const text = textInput.value;
  const characters = countCharacters(text);
  const words = countWords(text);

  characterCount.textContent = formatNumber(characters);
  wordCount.textContent = formatNumber(words);
  sentenceCount.textContent = formatNumber(countSentences(text));
  noSpaceNote.hidden = !excludeSpaces.checked;
  readingTime.textContent = getReadingTime(words);

  updateLimitWarning(characters);
  updateLetterDensity(text);
}

function toggleLetters() {
  showAllLetters = !showAllLetters;

  seeMoreButton.setAttribute("aria-expanded", showAllLetters);
  seeMoreText.textContent = showAllLetters ? "See less" : "See more";

  updateLetterDensity(textInput.value);
}

function toggleTheme() {
  const isLight = document.body.classList.toggle("light-theme");

  themeIcon.src = isLight ? "./images/night-mode.png" : "./images/icon-sun.svg";
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
}

textInput.addEventListener("input", updateStats);
excludeSpaces.addEventListener("change", updateStats);
limitToggle.addEventListener("change", updateStats);
limitInput.addEventListener("input", updateStats);
seeMoreButton.addEventListener("click", toggleLetters);
themeToggle.addEventListener("click", toggleTheme);

updateStats();
