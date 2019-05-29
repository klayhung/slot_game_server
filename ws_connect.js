const WebSocket = require('ws');
const gm = require('./game_manage');

const wss = new WebSocket.Server({
    port: 8080,
});

const connections = {};
let connectionIDCounter = 0;

/** 接收 Client 連線 */
wss.on('connection', (ws) => {
    ws.id = ++connectionIDCounter;
    connections[ws.id] = ws;
    gm.createGame(ws);

    /** 接收 Client 關閉連線訊息 */
    ws.on('close', () => {
        console.log(`ws id: ${ws.id} close connect`);
        delete connections[ws.id];
    });

    /** 接收 Client 錯誤訊息 */
    ws.on('error', (err) => {
    });

    /** 接收 Client 訊息 */
    ws.on('message', (data) => {
        gm.receiveClientPackage(ws.id, data);
        console.log(`ws id: ${ws.id}`);
        console.log(`server rcv data: ${data}`);
    });
});
