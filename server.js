// https://github.com/websockets/ws

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const pIds = [10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008];

const STIM_INTERVAL = 80; //ms between stimulations

let connection = (ws) => {
  let websocket = ws; // keep state of this ws connection

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
  let singlePhospheneSweep = (randomIntensity) => {
    curr += 1;
    return [newPhosphene(pIds[curr % pIds.length], randomIntensity)];
  }

  let fullSetPayloadWithFullIntensity = () => {
    return pIds.map(x => newPhosphene(x, false));
  }

  let fullSetPayloadWithRandomPhosphene = (randomIntensity) => {
    let payload = pIds.map(x => newPhosphene(x, randomIntensity)).map(x => { x.int = 0; return x; });
    let id = Math.round((Math.random() * 10 * 7) / 10); 
    payload[id].int = 1
    return payload;
  }
 
  // ---------

  websocket.on('message', (msg) => {
      console.log('Server received: %s\n', msg);
  })
  
  websocket.on('close', (msg) => {
    console.log("Client Disconnected");
  })

  let init = () => {
    console.log('Client connected');
  }

  let start = () => {
    setInterval(() => {
      // let payload = JSON.stringify(randomPhosphenes(4));
      let payload = JSON.stringify(singlePhospheneSweep(false));
      // let payload = JSON.stringify(fullSetPayloadWithRandomPhosphene(false));
      // let payload = JSON.stringify(fullSetPayloadWithFullIntensity());
      // console.log(payload);
      websocket.send(payload);
    }, STIM_INTERVAL);
  }

  return {
    init: init,
    start: start
  }

}

let interfaces = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family==='IPv4' && !i.internal && i.address || []), [])), []);
console.log(`Server listening on: ${interfaces}`);

let clients = [];
wss.on('connection', (ws) => {
  let client = connection(ws);
  client.init();
  client.start();

  clients.push(client);
  // not cleaning up disconnected clients. Naughty.
});
