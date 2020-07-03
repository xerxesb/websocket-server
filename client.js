// https://github.com/websockets/ws

const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    ws.send('Sent from client');
});

ws.on('message', (data) => {
    console.log('Client received: %s', data);
})