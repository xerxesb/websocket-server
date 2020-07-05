// https://github.com/websockets/ws

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const pIds = [10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008];

let newPhosphene = (id, random = false) => {
  return { id: id, int: random ? Math.round(Math.random() * 10) / 10 : 1 }
}

let randomPhosphenes = (upTo) => {
  return pIds
          .sort(() => 0.5 - Math.random())
          .slice(0, upTo)
          .map(x => newPhosphene(x, true));
};

var curr = 0;
let singlePhospheneSweep = () => {
  curr += 1;
  return [newPhosphene(pIds[curr % pIds.length])];
}

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (msg) => {
        console.log('Server received: %s\n', msg);
    })

    setInterval(() => {
      let payload = JSON.stringify(randomPhosphenes(4));
      // let payload = JSON.stringify(singlePhospheneSweep());
      console.log(payload);
      ws.send(payload);
    }, 80);
});
