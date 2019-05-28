const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8080,
});

let userCounts = 0;
const userInitCredit = 10000;
const userNameList = [];
const userInfoList = [];
const userInfoMap = new Map();

/** 接收 Client 連線 */
wss.on('connection', (ws) => {
    /** 接收 Client 關閉連線訊息 */
    ws.on('close', () => {
    });

    /** 接收 Client 錯誤訊息 */
    ws.on('error', (err) => {
    });

    /** 接收 Client 訊息 */
    ws.on('message', (data) => {
        console.log(`server rcv data: ${data}`);
        const pkg = JSON.parse(data);

        switch (pkg.type) {
            case 'Login':
                {
                    const userName = pkg.message.userName;
                    if (userNameList.includes(userName)) {
                        // TODO
                        const userInfo = userInfoMap.get(userName);
                        ws.send(JSON.stringify({
                            type: `${pkg.type}`,
                            message: userInfo,
                        }));
                        console.log(`exist userInfo :${JSON.stringify(userInfo)}`);
                    }
                    else {
                        ++userCounts;
                        const userInfo = {
                            userID: userCounts,
                            userName,
                            credit: userInitCredit,
                        };
                        userNameList.push(userName);
                        userInfoList.push(userInfo);
                        userInfoMap.set(userName, userInfo);
                        ws.send(JSON.stringify({
                            type: `${pkg.type}`,
                            message: userInfo,
                        }));
                        console.log(`new userInfo :${JSON.stringify(userInfo)}`);
                    }
                }
                break;
            /** 處理 SymbolResult 封包 */
            case 'SymbolResult':
                {
                    /** Symbol 數量 */
                    const symbolCounts = pkg.message.symbolCounts;
                    /** Symbol Index */
                    const symbolIndexCounts = pkg.message.symbolIndexCounts;
                    /** Symbol 陣列 (亂數) */
                    const symbolsResult = [];
                    for (let i = 0; i < symbolCounts; i += 1) {
                        symbolsResult.push(getRandomSymbolIndex(symbolIndexCounts));
                    }
                    console.log(`symbolsResult: ${symbolsResult}`);
                    ws.send(JSON.stringify({
                        type: `${pkg.type}`,
                        message: { symbols: symbolsResult },
                    }));
                }
                break;
            default:
                break;
        }
    });
});

/**
 * 取得隨機亂數
 * @param {Number} num 數值，ex.num: 6 get: 0 - 5
 */
function getRandomSymbolIndex(num) {
    return Math.floor(Math.random() * Math.floor(num));
}
