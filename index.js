const app = require('./app');

require('dotenv').config()

const appWs = require('./app-ws');

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`App Express is running!`);
})

const wss = appWs(server);

setInterval(() => {
    wss.broadcast({ n: Math.random() });
}, 1000)


// git add .
// git commit -am "make it better"
// git push heroku master