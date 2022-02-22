  const RANDOM_PROMPT_URL = 'http://127.0.0.1:443/randomprompt'
  const promptDisplay = document.getElementById('prompt-display')


function getRandPrompt() {
  console.log(RANDOM_PROMPT_URL)
  return fetch(RANDOM_PROMPT_URL)
    .then(response => response.json())
    .then(data => data.prompt)
}

async function renderPrompt() {
    const prompt = await getRandPrompt();
    console.log("The following is the letter prompt:")
    console.log(prompt)
    promptDisplay.innerText = prompt
}

renderPrompt()