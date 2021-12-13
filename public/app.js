let history = document.getElementById('history')
let enviar = document.getElementById('enviar')
let send = document.getElementById('send')

// let webSocket = new WebSocket("ws://testemauricio.herokuapp.com/wbs?token=123456");
let webSocket = new WebSocket("ws://localhost:3000/device?device=123456");

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