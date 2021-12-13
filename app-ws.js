const WebSocket = require('ws');

function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}

function onMessage(ws, data) {
    console.log(`onMessage: ${data}`);
    ws.send(`recebido!: ${data}`);
}

function disconection(ws, data) {
    console.log(ws.ID);
    console.log(`disconection ${ws.ID}`);
}

function onConnection(ws, req) {
    const parsedUrl = new URL(`http://localhost:3000${req.url}`);
    // const id = parsedUrl.searchParams.get("id");
    // ws.ID = id
    ws.on('close', data => { disconection(ws, data) })
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    console.log(`onConnection`);
}


function broadcast(jsonObject) {
    if (!this.clients) return;
    this.clients.forEach(client => {
        // console.log(client.ID);
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(jsonObject));
        }
    });
}

function corsValidation(origin) {
    return process.env.CORS_ORIGIN === '*' || process.env.CORS_ORIGIN.startsWith(origin);
}

function verifyClient(info, callback) {
    // if (!corsValidation(info.origin)) return callback(false);
    const parsedUrl = new URL(`http://localhost:3000${info.req.url}`);
    const device = parsedUrl.searchParams.get("device");

    if (device) {
        if (device === '123456')
            return callback(true);
    }

    return callback(false);
}

module.exports = (server) => {
    const wss = new WebSocket.Server({
        server,
        // verifyClient,
        path: "/device"
    });

    wss.on('connection', onConnection);
    wss.broadcast = broadcast;
    console.log(`App Web Socket Server is running!`);
    return wss;
}