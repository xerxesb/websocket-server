// https://github.com/websockets/ws

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let randomPhosphenes = (upTo) => {
  const pIds = [10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008];
  return pIds
          .sort(() => 0.5 - Math.random())
          .slice(0, upTo)
          .map(x => { return { id: x, int: Math.round(Math.random() * 10) / 10 } });
}

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (msg) => {
        console.log('Server received: %s\n', msg);
    })

    setInterval(() => {
      let payload = JSON.stringify(randomPhosphenes(4));
      console.log(payload);
      ws.send(payload);
    }, 80);
});
