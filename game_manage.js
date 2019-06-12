const Game = require('./game');

module.exports = {
    ws: {},
    gamesMap: new Map(),
    usersMap: new Map(),
    packageFromMap: new Map(),

    /**
     * GameManage 初始
     */
    init() {
        this.packageFromMap.set('Client', this.parserClientPackage.bind(this));
        this.packageFromMap.set('User', this.parserServerPackage.bind(this));
        this.packageFromMap.set('Default', this.parserServerPackage.bind(this));
    },

    /**
     * 收到 Server 連線
     * @param {Object} ws 單一 websocket 連線物件
     */
    receiveConnect(ws) {
        this.ws = ws;
    },

    /**
     * 創建 Game
     * @param {Integer} clientID 單一 websocket 連線物件 id
     */
    createGame(clientID) {
        const game = new Game();
        game.init(this);
        this.gamesMap.set(clientID, game);
    },

    /**
     * 刪除 Game
     * @param {Integer} clientID 單一 websocket 連線物件 id
     */
    destroyGame(clientID) {
        if (this.gamesMap.has(clientID)) {
            console.log(`destory game : ${clientID}`);
            delete this.gamesMap[clientID];
        }
    },

    /**
     * 接收 Client、Server 訊息
     * @param {JSON} data 封包
     */
    receivePackage(data) {
        console.log(`server rec : ${data}`);
        const pkg = JSON.parse(data);
        const key = (pkg.from === undefined) ? 'Default' : pkg.from;
        this.packageFromMap.get(key)(pkg);
    },

    /**
     * 處理 Client 訊息
     * @param {Object} pkg 封包物件
     */
    parserClientPackage(pkg) {
        switch (pkg.type) {
            case 'GameInit':
                if (pkg.clientID === undefined) {
                    return;
                }
                this.createGame(pkg.clientID);
                this.gamesMap.get(pkg.clientID).dealC2S(pkg, this);
                break;
            default:
                this.gamesMap.get(pkg.clientID).dealC2S(pkg, this);
                break;
        }
    },

    /**
     * 處理 Server 訊息
     * @param {Object} pkg 封包物件
     */
    parserServerPackage(pkg) {
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
                this.gamesMap.get(pkg.clientID).dealS2S(pkg, this);
                break;
        }
    },

    /**
     * 發送訊息 to Client、Server
     * @param {JSON} data 封包
     */
    sendPackage(data) {
        console.log(`server send : ${JSON.stringify(data)}`);
        this.ws.send(JSON.stringify(data));
    },
};
