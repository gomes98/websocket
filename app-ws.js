const WebSocket = require('ws');

let devices = []

let clients = []

let joins = []

function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}

function onMessage(ws, data) {
    console.log(`onMessage: ${data}`);
    // if (ws.device) {
    let toSend = joins.filter(e => e.device == ws.device)
    toSend.forEach(e => {
            sendToClient(e.client, `${data}`)
        })
        // }
        // if (ws.client) {
        //     let toSend = joins.filter(e => e.client == ws.client)
        //     toSend.forEach(e => {
        //         sendToDevice(e.device, `${data}`)
        //     })
        // }
}

function disconection(ws, data) {
    if (ws.device) {
        let idx = devices.findIndex(e => e == ws.device)
        devices.splice(idx, 1)
    }
    if (ws.client) {
        let idx = clients.findIndex(e => e == ws.client)
        clients.splice(idx, 1)
    }
}

function addNewSocket(device, client) {
    if (device) {
        let idx = devices.findIndex(e => e == device)
        if (idx == -1) {
            devices.push(device)
        }
    }
    if (client) {
        let idx = clients.findIndex(e => e == client)
        if (idx == -1) {
            clients.push(client)
        }
    }
}

function onConnection(ws, req) {
    const parsedUrl = new URL(`http://localhost:3000${req.url}`);
    const device = parsedUrl.searchParams.get("device");
    const client = parsedUrl.searchParams.get("client");
    if (device) {
        ws.device = device
        addNewSocket(device, 0)
    }
    if (client) {
        ws.client = client
        addNewSocket(null, client)
    }

    console.log(`Devices: ${devices.length} Clients: ${clients.length}`);

    // broadcast({ online: { devices, clients } })

    console.log({ devices, clients });

    ws.on('ping', data => {
        console.log("PING");
    })

    ws.on('close', data => { disconection(ws, data) })
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    console.log(`onConnection`);
}


function broadcast(jsonObject) {
    if (!wss.clients) return;
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(jsonObject));
        }
    });
}

function sendToDevice(device, data) {
    wss.clients.forEach(client => {
        if (client.device == device && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function joinClientDevice(device, client) {
    joins.push({ device, client })
}

function checkDevice(device) {
    let dvc = devices.find(e => e == device)
    if (dvc) {
        return true
    } else {
        return false
    }
}

function sendToClient(clienttoSend, data) {
    wss.clients.forEach(client => {
        if (client.client == clienttoSend && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function corsValidation(origin) {
    return process.env.CORS_ORIGIN === '*' || process.env.CORS_ORIGIN.startsWith(origin);
}

function verifyClient(info, callback) {
    console.log(`Cors Validation ${!corsValidation(info.origin)} origin: ${info.origin}`);
    // if (!corsValidation(info.origin)) return callback(false);
    const parsedUrl = new URL(`http://localhost:3000${info.req.url}`);
    const device = parsedUrl.searchParams.get("device");
    const client = parsedUrl.searchParams.get("client");
    if (device) {
        console.log(device);
        return callback(true);
    }
    if (client) {
        console.log(client);
        return callback(true);
    }
    return callback(false);
}
let wss
module.exports = (server) => {
    wss = new WebSocket.Server({
        server,
        verifyClient,
        // path: "/"
    });

    wss.on('connection', onConnection);
    wss.broadcast = broadcast;
    wss.sendToDevice = sendToDevice;
    wss.sendToClient = sendToClient;
    wss.joinClientDevice = joinClientDevice;
    wss.checkDevice = checkDevice;
    console.log(`App Web Socket Server is running!`);
    return wss;
}