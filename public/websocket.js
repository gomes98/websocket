let history = document.getElementById('history')
let select = document.getElementById('online')
let enviar = document.getElementById('enviar')
let send = document.getElementById('send')

let baseUrl = window.location.href;
let urlWs = ""
if (baseUrl.startsWith("https")) {
    urlWs = `wss${baseUrl.replace("https", "")}`
} else if (baseUrl.startsWith("http")) {
    urlWs = `ws${baseUrl.replace("http", "")}`
}

// let webSocket = new WebSocket(`${urlWs}?client=123456`);


// webSocket.onopen = function(event) {
//     console.log("conectou");
// };

// webSocket.onmessage = (data) => {
//     history.value += data.data + "\n"
//     history.scrollTop = history.scrollHeight;
//     let json
//     try {
//         json = JSON.parse(data.data);
//     } catch (error) {
//         console.log(error);
//     }
//     if (json.online) {
//         let online = json.online
//         online.devices.forEach(element => {
//             select.options[select.options.length] = new Option(element, element);
//         });
//         // online.clients.forEach(element => {
//         //     select.options[select.options.length] = new Option(element, element);
//         // });
//     }
// }

// webSocket.onclose = (e) => {
//     console.log("Fechou " + e);
// }

send.addEventListener('click', () => {
    webSocket.send(enviar.value)
    enviar.value = ""
})
var webSocket
var client

function connect(clientId) {
    if (clientId) {
        client = clientId
    }
    webSocket = null
    webSocket = new WebSocket(`${urlWs}?client=${clientId != null ? clientId: client}`);
    webSocket.onopen = function() {
        console.log("conectado");
    };

    webSocket.onmessage = function(data) {
        history.value += data.data + "\n"
        history.scrollTop = history.scrollHeight;
        let json
        try {
            json = JSON.parse(data.data);
            // console.log(json);
        } catch (error) {
            console.log(error);
        }
        if (json.online) {
            let online = json.online
            online.devices.forEach(element => {
                select.options[select.options.length] = new Option(element, element);
            });
            // online.clients.forEach(element => {
            //     select.options[select.options.length] = new Option(element, element);
            // });
        }
    };

    webSocket.onclose = function(e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function() {
            connect();
        }, 1000);
    };

    webSocket.onerror = function(err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        webSocket.close();
    };
}

// connect();