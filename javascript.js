
const textInput = document.getElementById("text-input");
const excludeSpaces = document.getElementById("exclude-spaces");
const characterLimit = document.getElementById("character-limit");

const characterCount = document.querySelector(".characters-card .stat-number");
const wordCount = document.querySelector(".words-card .stat-number");
const sentenceCount = document.querySelector(".sentences-card .stat-number");

const densityList = document.querySelector(".density-list");
const expandButton = document.getElementById("expand-density");
const themeButton = document.querySelector(".theme-toggle");
const themeImage = themeButton.querySelector("img");

// Create a message for the character limit
const limitMessage = document.createElement("p");
limitMessage.style.marginTop = "10px";
limitMessage.style.fontSize = "14px";
limitMessage.style.color = "var(--orange)";
limitMessage.setAttribute("aria-live", "polite");

textInput.parentElement.appendChild(limitMessage);

// Show the character, word and sentence counts
function updateCounts() {
  const text = textInput.value;

  let characters = text.length;

  if (excludeSpaces.checked) {
    characters = text.replace(/\s/g, "").length;
  }

  const words = text.trim() === ""
    ? 0
    : text.trim().split(/\s+/).length;

  const sentences = text.trim() === ""
    ? 0
    : (text.match(/[.!?]+(?=\s|$)/g) || []).length
      + (/[.!?]$/.test(text.trim()) ? 0 : 1);

  characterCount.textContent = characters.toString().padStart(2, "0");
  wordCount.textContent = words.toString().padStart(2, "0");
  sentenceCount.textContent = sentences.toString().padStart(2, "0");

  checkCharacterLimit(characters);
  updateLetterDensity(text);
}

// Check whether the character limit has been reached
function checkCharacterLimit(characters) {
  const limit = Number(characterLimit.value);

  if (characterLimit.value !== "" && limit > 0) {
    if (characters > limit) {
      limitMessage.textContent =
        `You are ${characters - limit} characters over your limit.`;
    } else if (characters === limit) {
      limitMessage.textContent = "You have reached your character limit.";
    } else {
      limitMessage.textContent =
        `${limit - characters} characters remaining.`;
    }
  } else {
    limitMessage.textContent = "";
  }
}

// Calculate how often each letter appears
function updateLetterDensity(text) {
  const letters = text.toLowerCase().match(/[a-z]/g) || [];
  const letterTotals = {};

  letters.forEach(function (letter) {
    if (letterTotals[letter]) {
      letterTotals[letter]++;
    } else {
      letterTotals[letter] = 1;
    }
  });

  const sortedLetters = Object.entries(letterTotals)
    .sort(function (a, b) {
      return b[1] - a[1] || a[0].localeCompare(b[0]);
    });

  densityList.innerHTML = "";

  const lettersToShow = showAllLetters
    ? sortedLetters
    : sortedLetters.slice(0, 5);

  lettersToShow.forEach(function (item) {
    const letter = item[0];
    const count = item[1];
    const percentage = (count / letters.length) * 100;

    const row = document.createElement("div");
    row.className = "density-row";

    const letterLabel = document.createElement("span");
    letterLabel.className = "density-letter";
    letterLabel.textContent = letter.toUpperCase();

    const bar = document.createElement("div");
    bar.className = "density-bar";

    const fill = document.createElement("span");
    fill.style.width = `${percentage}%`;
    bar.appendChild(fill);

    const countLabel = document.createElement("span");
    countLabel.className = "density-count";
    countLabel.textContent = count;

    const percentLabel = document.createElement("span");
    percentLabel.className = "density-percent";
    percentLabel.textContent = `${percentage.toFixed(1)}%`;

    row.append(letterLabel, bar, countLabel, percentLabel);
    densityList.appendChild(row);
  });

  if (letters.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Type some text to see letter density.";
    message.style.color = "var(--muted)";
    densityList.appendChild(message);
  }

  expandButton.hidden = sortedLetters.length <= 5;

  expandButton.textContent = showAllLetters
    ? "See less"
    : "See more";
}

// Expand or collapse the letter density list
let showAllLetters = false;

expandButton.addEventListener("click", function () {
  showAllLetters = !showAllLetters;
  updateLetterDensity(textInput.value);
});

// Switch between dark and light themes
let lightTheme = false;

themeButton.addEventListener("click", function () {
  lightTheme = !lightTheme;

  if (lightTheme) {
    document.documentElement.style.setProperty("--background", "#f5f5f8");
    document.documentElement.style.setProperty("--card", "#ffffff");
    document.documentElement.style.setProperty("--card-hover", "#e8e8ef");
    document.documentElement.style.setProperty("--text", "#20202a");
    document.documentElement.style.setProperty("--muted", "#626270");
    document.documentElement.style.setProperty("--border", "#d2d2df");
    themeImage.src = "./images/night-mode.png";
    themeButton.setAttribute("aria-label", "Switch to dark theme");
  } else {
    document.documentElement.style.setProperty("--background", "#12131a");
    document.documentElement.style.setProperty("--card", "#21222c");
    document.documentElement.style.setProperty("--card-hover", "#2a2b37");
    document.documentElement.style.setProperty("--text", "#f2f2f7");
    document.documentElement.style.setProperty("--muted", "#c8c8d0");
    document.documentElement.style.setProperty("--border", "#404254");
    themeImage.src = "./images/summer.png";
    themeButton.setAttribute("aria-label", "Switch to light theme");
  }
});

// Update the counts whenever the text or options change
textInput.addEventListener("input", updateCounts);
excludeSpaces.addEventListener("change", updateCounts);
characterLimit.addEventListener("input", updateCounts);

// Set the correct counts when the page first opens
updateCounts();