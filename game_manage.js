const Game = require('./game');
const dbConnection = require('./db_connect');

module.exports = {
    gameMap: new Map(),

    userCounts: 0,
    userPoint: 10000,
    userNameList: [],
    userInfoList: [],
    userInfoMap: new Map(),

    init() {
        dbConnection.connect();
    },

    createGame(ws) {
        const game = new Game();
        game.init(ws, this);
        this.gameMap.set(ws.id, game);
    },

    receiveClientPackage(wsID, data) {
        const game = this.gameMap.get(wsID);
        if (game !== undefined) {
            const pkg = JSON.parse(data);
            switch (pkg.type) {
                case 'Login':
                    {
                        const userName = pkg.message.userName;
                        let userInfo = {};
                        dbConnection.query(`select * from User where userName = "${userName}"`, (results) => {
                            if (results.length === 1) {
                                userInfo = JSON.parse(JSON.stringify(results[0]));
                                this.userInfoMap.set(userName, userInfo);
                                game.ws.send(JSON.stringify({
                                    type: `${pkg.type}`,
                                    message: { userInfo },
                                }));
                            }
                            else if (results.length === 0) {
                                userInfo = {
                                    userID: -1,
                                    userName,
                                    userPoint: this.userPoint,
                                };
                                const addUserToSql = `insert into User (userName, userPoint) values ('${userName}', ${this.userPoint})`;
                                dbConnection.query(addUserToSql, (insertResults) => {
                                    const insertObj = JSON.parse(JSON.stringify(insertResults));
                                    console.log(JSON.stringify(insertResults));
                                    console.log(insertObj.insertId);
                                    userInfo.userID = insertObj.insertId;
                                    this.userInfoMap.set(userName, userInfo);
                                    game.ws.send(JSON.stringify({
                                        type: `${pkg.type}`,
                                        message: { userInfo },
                                    }));
                                });
                            }
                        });
                    }
                    break;
                case 'Logout':
                    {
                        const userInfo = pkg.message;
                        const updateUserToSql = `UPDATE User SET userPoint = ${userInfo.userPoint} WHERE userID = ${userInfo.userID}`;
                        console.log(`updateUserToSql: ${updateUserToSql}`);
                        dbConnection.query(updateUserToSql, () => {});
                    }
                    break;
                default:
                    game.dealC2S(data, this);
                    break;
            }
        }
    },
};
