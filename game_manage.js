const Game = require('./game');
const User = require('./user');

module.exports = {
    ws: {},
    gamesMap: new Map(),
    usersMap: new Map(),

    /**
     * GameManage 初始
     */
    init() {
        // dbConnection.connect();
    },

    receiveConnect(ws) {
        this.ws = ws;
    },

    /**
     * 創建 Game
     * @param {Object} ws 單一 websocket 連線物件
     */
    createGame(clientID) {
        const game = new Game();
        game.init(this);
        this.gamesMap.set(clientID, game);
    },

    destroyGame(clientID) {
        if (this.gamesMap.has(clientID)) {
            console.log(`destory game : ${clientID}`);
            delete this.gamesMap[clientID];
        }
    },

    /**
     * 接收 Client 訊息
     * @param {Integer} wsID
     * @param {JSON} data
     */
    receivePackage(wsID, data) {
        const pkg = JSON.parse(data);
        if (pkg.from === 'Client') {
            switch (pkg.type) {
                case 'GameInit':
                    if (pkg.clientID === undefined) {
                        return;
                    }
                    this.createGame(pkg.clientID);
                    this.gamesMap.get(pkg.clientID).dealC2S(data, this);
                    break;
                default:
                    this.gamesMap.get(pkg.clientID).dealC2S(data, this);
                    break;
            }
        }
        else {
            switch (pkg.type) {
                case 'RegisterPackage':
                    {
                        const RegisterPackage = {
                            type: pkg.type,
                            message: {
                                serverName: 'Game',
                                pkgNames: ['GameInit', 'SlotSpin'],
                            },
                        };
                        this.sendPackage(RegisterPackage);
                    }
                    break;
                default:
                    this.gamesMap.get(pkg.clientID).dealS2S(data, this);
                    break;
            }
        }
    },

    sendPackage(data) {
        console.log(`server send : ${JSON.stringify(data)}`);
        this.ws.send(JSON.stringify(data));
    },
};
