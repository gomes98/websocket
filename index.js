const app = require('./app');

require('dotenv').config()

const appWs = require('./app-ws');

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`App Express is running!`);
})

const wss = appWs(server);

app.post('/cmd', (req, res, next) => {
    console.log(req.body);
    if (req.body.device && req.body.data) {
        wss.sendToDevice(req.body.device, req.body.data)
        return res.status(204).send()
    } else {
        return res.status(400).send()
    }
});

app.post('/join', (req, res, next) => {
    if (req.body.device && req.body.client) {
        wss.joinClientDevice(req.body.device, req.body.client)
        return res.status(204).send()
    } else {
        return res.status(400).send()
    }
});

app.post('/check', (req, res, next) => {
    if (req.body.device) {
        let sts = wss.checkDevice(req.body.device)
        if (sts) {
            return res.status(200).send(`${randomInterval(1, 10000)}`)
        } else {
            return res.status(404).send()
        }
    } else {
        return res.status(400).send()
    }
});


// setInterval(() => {
//     wss.broadcast({ n: Math.random() });
// }, 1000)

function randomInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
// git add .
// git commit -am "make it better"
// git push heroku master