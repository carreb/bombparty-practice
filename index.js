  const RANDOM_PROMPT_URL = 'http://127.0.0.1:443/randomprompt'


function getRandPrompt() {
  console.log(RANDOM_PROMPT_URL)
  return fetch(RANDOM_PROMPT_URL)
    .then(response => response.json())
    .then(data => data.prompt)
}

async function getNextPrompt() {
    const prompt = await getRandPrompt();
    console.log("The following is the letter prompt:")
    console.log(prompt)
}

getNextPrompt()