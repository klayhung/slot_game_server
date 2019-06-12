const WebSocket = require('ws');
const gm = require('./game_manage');

const wss = new WebSocket.Server({
    port: 8081,
});

const connections = {};
let connectionIDCounter = 0;
gm.init();

/** 接收 Client 連線 */
wss.on('connection', (ws) => {
    ws.id = ++connectionIDCounter;
    connections[ws.id] = ws;
    gm.receiveConnect(ws);

    /** 接收 Client 關閉連線訊息 */
    ws.on('close', () => {
        console.log(`ws id: ${ws.id} close connect`);
        delete connections[ws.id];
    });

    /** 接收 Client 錯誤訊息 */
    ws.on('error', () => {
    });

    /** 接收 Client 訊息 */
    ws.on('message', (data) => {
        console.log(`ws id: ${ws.id}`);
        console.log(`server rcv data: ${data}`);
        gm.receivePackage(data);
    });
});
