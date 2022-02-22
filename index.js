var fs = require("fs");
var prompts = fs.readFile("./dict/prompts.txt").toString().split("\n");

function getRandPrompt() {
  var randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  return randomPrompt;
}

async function getPrompt() {
    const prompt = await getRandPrompt();
    console.log(prompt)
}

getPrompt()