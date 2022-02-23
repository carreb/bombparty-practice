  const RANDOM_PROMPT_URL = 'http://127.0.0.1:443/randomprompt'
  const HYPHENATED_CHECK_URL = 'http://127.0.0.1:443/cflhyphenated/'
  const promptDisplay = document.getElementById('prompt-display')
  const wordInput = document.getElementById('wordInput')
  const submitButton = document.getElementById('submitButton')
  var promptRelated = {};

function getRandPrompt() {
  console.log(RANDOM_PROMPT_URL)
  return fetch(RANDOM_PROMPT_URL)
    .then(response => response.json())
    .then(data => data.prompt)
}


async function renderPrompt() {
    promptRelated.prompt = await getRandPrompt();
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

function checkCorrect(inputVal) {
  return fetch(HYPHENATED_CHECK_URL + inputVal + ',' + promptRelated.prompt)
  .then(response => response.json())
  .then(data => data.response)
}

async function getCorrectResponse(inputVal) {
  var correctResponse = await checkCorrect(inputVal)
  if (correctResponse === "true") {
    console.log("Valid word")
  }
  else if (correctResponse === "false") {
    console.log("Invalid word")
    fetch(HYPHENATED_CHECK_URL + inputVal + ',' + promptRelated.prompt)
      .then(response => response.json())
      .then(data => console.log("reason: " + data.reason))

  }
}

renderPrompt()