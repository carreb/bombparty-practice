import json
import secrets
import re
from flask import Flask
from flask_cors import CORS, cross_origin
import flask
import sys
__name__ = "main"
app = Flask(__name__)
CORS(app)

with open('./dict/hyphen-dict.txt') as f:
    global marathonList
    marathonList = []
    marathonwords = f.readlines()
    for word in marathonwords:
        m = word.replace('\n', '')
        m = m.replace('\u00e2\u20ac\u2122', "'")
        marathonList.append(m.lower())

@app.route('/randomprompt', methods=['GET'])
def get_random_prompt():
    with open('./dict/prompts.txt') as f:
        prompts = f.readlines()
        #remove \n from each line (wow thanks copilot!)
        prompts = [x.strip() for x in prompts]
        response = flask.jsonify({'prompt': secrets.choice(prompts)})
        return response
@app.route('/hyphenatedwords')
def get_hyphenated_words():
    with open('./dict/hyphen-dict.txt') as f:
        hyphenatedwords = f.readlines()
        hyphenList = []
        for word in hyphenatedwords:
          hyphen = word.replace('\n', '')
          h = hyphen.replace('\u00e2\u20ac\u2122', "'")
          hyphenList.append(h.lower())
        return json.dumps({'response': hyphenList})
@app.route('/cflhyphenated/<inputword>,<promptedletters>', methods=['GET'])
def check_for_letters_in_word_hyphenated(inputword, promptedletters):
    with open('./dict/hyphen-dict.txt') as f:
        hyphenatedwords = f.readlines()
        hyphenList = []
        for word in hyphenatedwords:
            hyphen = word.replace('\n', '')
            h = hyphen.replace('\u00e2\u20ac\u2122', "'")
            hyphenList.append(h.lower())
        if promptedletters in inputword:
            if inputword in hyphenList:
                if '-' in inputword:
                    return json.dumps({'response': 'true', 'reason': 'word found in dict & passed all checks'})
                else:
                    return json.dumps({'response': 'false', 'reason': 'no hyphen'})
            else:
                return json.dumps({'response': 'false', 'reason': 'word not in list', 'word': inputword.lower()})
        else:
            return json.dumps({'response': 'false', 'reason': 'no prompt letters in word'})
@app.route('/checkvalidwordshyphenated/<prompt>', methods=['GET'])
def check_valid_words(prompt):
    with open('./dict/hyphen-dict.txt') as f:
        hyphenatedwords = f.readlines()
        hyphenList = []
        for word in hyphenatedwords:
            word = word.lower()
            if prompt in word:
                hyphen = word.replace('\n', '')
                h = hyphen.replace('\u00e2\u20ac\u2122', "'")
                hyphenList.append(h.lower())
        return json.dumps({'response': hyphenList, 'longest': max(hyphenList, key=len), 'shortest': min(hyphenList, key=len), 'random': secrets.choice(hyphenList), 'amount': len(hyphenList)})


@app.route('/marathonprompt/hyphenated', methods=['GET'])
def get_marathon_prompt_hyphenated():
    global marathonList
    letterAmt = 0
    word = secrets.choice(marathonList)
    marathonList.remove(word)
    word = list(word)
    for letter in word:
        if letter == '-':
            pass
        elif letter == "'":
            pass
        else:
            letterAmt += 1
    promptLetters = secrets.choice(range(4))
    if promptLetters == 1:
        promptLetters = 2
    random1 = secrets.choice(range(letterAmt))
    if random1 == letterAmt:
        if promptLetters == 2:
            random1 = random1 - 1
        if promptLetters == 3:
            random1 = random1 - 2
    random2 = random1 + 1
    if promptLetters == 3:
        random3 = random1 + 2
    else:
        random3 = "null"
    if random3 != "null":
        try:
          return json.dumps({'response': word[random1] + word[random2] + word[random3], 'wordsLeft': len(marathonList)})
        except IndexError:
            marathonList.append(word)
            return get_marathon_prompt_hyphenated()
    else:
        return json.dumps({'response': word[random1] + word[random2], 'wordsLeft': len(marathonList)})



if __name__ == 'main':
    print('True')
    app.run(host='127.0.0.1', port=443, debug=True)