import json
import secrets
import re

from flask import Flask
__name__ = "main"
app = Flask(__name__)

@app.route('/randomprompt')
def get_random_prompt():
    with open('./dict/prompts.txt') as f:
        prompts = f.readlines()
        return json.dumps({'prompt': secrets.choice(prompts)})
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


if __name__ == 'main':
    print('True')
    app.run(host='127.0.0.1', port=443, debug=True)