let history = document.getElementById('history')
let enviar = document.getElementById('enviar')
let send = document.getElementById('send')

let baseUrl = window.location.href;
let urlWs = ""
if (baseUrl.startsWith("https")) {
    urlWs = `wss${baseUrl.replace("https", "")}`
} else if (baseUrl.startsWith("http")) {
    urlWs = `ws${baseUrl.replace("http", "")}`
}

let webSocket = new WebSocket(`${urlWs}device?device=123456`);


webSocket.onopen = function(event) {
    console.log("conectou");
};

webSocket.onmessage = (data) => {
    history.value += data.data + "\n"
    history.scrollTop = history.scrollHeight;
}

send.addEventListener('click', () => {
    webSocket.send(enviar.value)
    enviar.value = ""
})