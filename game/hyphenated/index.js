  const RANDOM_PROMPT_URL = 'https://bombparty-api.herokuapp.com/randomprompt'
  const HYPHENATED_CHECK_URL = 'https://bombparty-api.herokuapp.com/cflhyphenated/'
  const HELP_URL = 'https://bombparty-api.herokuapp.com/checkvalidwordshyphenated/'
  const helpButton = document.getElementById('helpbutton')
  const overlayBox = document.getElementById('overlay')
  const helpShortest = document.getElementById('shortestText')
  const helpLongest = document.getElementById('longestText')
  const helpRandom = document.getElementById('randomWordText')
  const devconsole = document.getElementById('devconsole')
  const devInput = document.getElementById('devInput')
  const allHelpOptionsButton = document.getElementById('seeAllButton')
  const promptDisplay = document.getElementById('prompt-display')
  const wordInput = document.getElementById('wordInput')
  const correctSound = new Audio('./assets/Yes.mp3')
  const incorrectSound = new Audio('./assets/No.mp3')
  var promptRelated = {};
  const rightOrWrong = document.getElementById('rightOrWrong')
  const streakDisplay = document.getElementById('streakCount')
  var currentStreak = 0

function getRandPrompt() {
  console.log(RANDOM_PROMPT_URL)
  return fetch(RANDOM_PROMPT_URL)
    .then(response => response.json())
    .then(data => data.prompt)
}


async function renderPrompt(inputVal) {
    promptRelated.prompt = await getRandPrompt();
    if (promptRelated.prompt === inputVal) {
      console.log("same prompt generated; generating new")
      return renderPrompt(promptRelated.prompt)
    }
    console.log("The following is the letter prompt:")
    console.log(promptRelated.prompt)
    promptDisplay.innerText = promptRelated.prompt
    wordInput.value = null
}

wordInput.addEventListener('input', () => {
  var inputVal = wordInput.value.toLowerCase()
  if (inputVal.includes(promptRelated.prompt)) {
    promptDisplay.classList.add('correctletters')
  }
  else if (!inputVal.includes(promptRelated.prompt)) {
    promptDisplay.classList.remove('correctletters')
  }
})

wordInput.addEventListener("keydown", function(e){
  if (e.key === "Enter") {
    var cachedValue = wordInput.value.toLowerCase()
    promptDisplay.classList.remove('correctletters')
    getCorrectResponse(cachedValue)
    wordInput.value = null
    }
})

function getHelpOptionsShortest() {
  return fetch(HELP_URL + promptRelated.prompt)
  .then(response => response.json())
  .then(data => data.shortest)
}
function getHelpOptionsLongest() {
  return fetch(HELP_URL + promptRelated.prompt)
  .then(response => response.json())
  .then(data => data.longest)
}

function getHelpOptionsRandom() {
  return fetch(HELP_URL + promptRelated.prompt)
  .then(response => response.json())
  .then(data => data.random)
}

function getHelpOptionsAmount() {
  return fetch(HELP_URL + promptRelated.prompt)
  .then(response => response.json())
  .then(data => data.amount)
}

async function setHelpOptions() {
  shortest = await getHelpOptionsShortest()
  longest = await getHelpOptionsLongest()
  random = await getHelpOptionsRandom()
  amount = await getHelpOptionsAmount()
  helpShortest.innerText = "shortest: " + shortest
  helpLongest.innerText = "longest: " + longest
  document.getElementById("amtOfWordsTxt").innerText = "Total Valid Words: " + amount
  if (amount === 1) {
    helpRandom.innerText = "Max1 (H)"
  }
  else if (amount === 2) {
    helpRandom.innerText = "Max2 (H)"
  }
  else {
    helpRandom.innerText = "random: " + random
  }
}

helpButton.addEventListener("click", () => {
  overlay.style.display = 'block'
  setHelpOptions()
})

allHelpOptionsButton.addEventListener("click", () => {
  window.open(HELP_URL + promptRelated.prompt)
})

function checkCorrect(inputVal) {
  return fetch(HYPHENATED_CHECK_URL + inputVal + ',' + promptRelated.prompt)
  .then(response => response.json())
  .then(data => data.response)
}

function getIncorrectReason(inputVal) {
  return fetch(HYPHENATED_CHECK_URL + inputVal + ',' + promptRelated.prompt)
  .then(response => response.json())
  .then(data => data.reason)
}

async function getCorrectResponse(inputVal) {
  var correctResponse = await checkCorrect(inputVal)
  if (correctResponse === "true") {
    correctSound.play()
    rightOrWrong.style.display = 'block'
    rightOrWrong.innerText = "✔ Correct!"
    rightOrWrong.classList.remove('incorrectword')
    rightOrWrong.classList.add('correctword')
    overlay.style.display = 'none'
    helpRandom.innerText = 'Loading...'
    helpShortest.innerText = 'Loading...'
    helpLongest.innerText = 'Loading...'
    renderPrompt(promptRelated.prompt)
    addToStreak()
  }
  else if (correctResponse === "false") {
    incorrectSound.play()
    rightOrWrong.classList.remove('correctword')
    var incorrectReason = await getIncorrectReason(inputVal)
    rightOrWrong.style.display = 'block'
    if (incorrectReason === "no hyphen") {
      rightOrWrong.classList.add('incorrectword')
      rightOrWrong.innerText = "✖ Incorrect! You didn't use a hyphen! This error is also impossible to get!"
      resetStreak()
  }
    else if (incorrectReason === "word not in list") {
      rightOrWrong.classList.add('incorrectword')
      rightOrWrong.innerText = "✖ Incorrect! Word is invalid!"
      resetStreak()
  }
    else if (incorrectReason === "no prompt letters in word") {
      rightOrWrong.classList.add('incorrectword')
      rightOrWrong.innerText = "✖ Incorrect! You didn't use the prompt letters!"
      resetStreak()
      if (inputVal.includes("developer_console")) {
        devconsole.style.display = "block"
        rightOrWrong.innerText = "Opened developer console."
        rightOrWrong.classList.remove("incorrectword")
}}}}

function addToStreak() {
  currentStreak += 1
  streakDisplay.innerText = currentStreak
}
function resetStreak() {
  streakDisplay.innerText = 0
  currentStreak = 0 
}

devInput.addEventListener("keydown", function(e){
  if (e.key === "Enter") {
    if (devInput.value == "close") {
      devconsole.style.display = "none"
      devInput.value = null
    }
    else if (devInput.value.includes("setprompt")) {
      var newPrompt = devInput.value.split(" ")[1]
      promptRelated.prompt = newPrompt
      promptDisplay.innerText = promptRelated.prompt
      devInput.value = null
    }
    else if (devInput.value.includes("refreshprompt")) {
      renderPrompt()
      devInput.value = null
    }
}})



renderPrompt()