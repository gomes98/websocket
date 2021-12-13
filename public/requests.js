function randomInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function request(url, body, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    // Envia a informação do cabeçalho junto com a requisição.
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() { // Chama a função quando o estado mudar.
        if (this.readyState === XMLHttpRequest.DONE) {
            // Requisição finalizada. Faça o processamento aqui.
            if (callback) {
                callback({ status: this.status, response: this.response })
            }
        }
    }
    xhr.send(body);
}

let btnCheck = document.getElementById('checkDevice')
btnCheck.addEventListener('click', () => {
    let device = document.getElementById('deviceMac').value
    if (device) {
        checkDevice(device)
    }
})

function checkDevice(device) {
    let url = window.location.href + "check"
    request(url, `{"device":"${device}"}`, (ret) => {
        console.log(ret);
        if (ret.status == 200 && ret.response) {
            joinDevice(device, ret.response)
        }
    })
}

function joinDevice(device, client) {
    let url = window.location.href + "join"
    request(url, `{"device":"${device}", "client":"${client}"}`, (ret) => {
        console.log(ret);
        connect(client)
    })
}