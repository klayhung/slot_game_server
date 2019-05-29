const Game = require('./game');

module.exports = {
    gameList: [],
    gameIDCounter: 0,

    userCounts: 0,
    userCredit: 10000,
    userNameList: [],
    userInfoList: [],
    userInfoMap: new Map(),

    createGame(ws, event) {
        const g = new Game();
        g.init(ws, this);
        this.gameList.push(g);
    },

    receiveClientPackage(wsID, data) {
        this.gameList.forEach((eachGame) => {
            if (eachGame.ws.id === wsID) {
                eachGame.dealC2S(data, this);
            }
        });
    },
};
