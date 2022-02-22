import json
import secrets

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
        Hyphenatedwords = f.readlines()
        return json.dumps({'response': Hyphenatedwords})


if __name__ == 'main':
    print('True')
    app.run(host='127.0.0.1', port=443, debug=True)