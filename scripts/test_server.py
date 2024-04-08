from flask import Flask, request
import pprint

class LoggingMiddleware(object):
    def __init__(self, app):
        self._app = app

    def __call__(self, env, resp):
        errorlog = env['wsgi.errors']
        pprint.pprint(('REQUEST', env), stream=errorlog)

        def log_response(status, headers, *args):
            pprint.pprint(('RESPONSE', status, headers), stream=errorlog)
            return resp(status, headers, *args)

        return self._app(env, log_response)


app = Flask(__name__)

@app.route("/room/<room_id>", methods=['POST'])
def hello_world(room_id):
    print(room_id)
    print(request.form)
    # print(request.query_string)

    return "<p>Hello, World!</p>"

app.wsgi_app = LoggingMiddleware(app.wsgi_app)
app.run(host="0.0.0.0", port=8000)