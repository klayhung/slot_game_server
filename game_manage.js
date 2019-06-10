const Game = require('./game');
const dbConnection = require('./db_connect');
const User = require('./user');

module.exports = {
    gamesMap: new Map(),
    usersMap: new Map(),

    /**
     * GameManage 初始
     */
    init() {
        dbConnection.connect();
    },

    /**
     * 創建 Game
     * @param {Object} ws 單一 websocket 連線物件
     */
    createGame(ws) {
        const game = new Game();
        game.init(ws);
        this.gamesMap.set(ws.id, game);
    },

    /**
     * 接收 Client 訊息
     * @param {Integer} wsID
     * @param {JSON} data
     */
    receiveClientPackage(wsID, data) {
        const game = this.gamesMap.get(wsID);
        if (game !== undefined) {
            const pkg = JSON.parse(data);
            switch (pkg.type) {
                case 'Login':
                    {
                        const userName = pkg.message.userName;
                        let user = new User();
                        dbConnection.query(`select * from User where userName = "${userName}"`, (results) => {
                            if (results.length === 1) {
                                user = JSON.parse(JSON.stringify(results[0]));
                                this.usersMap.set(userName, user);
                                game.setUser(user);
                                game.ws.send(JSON.stringify({
                                    type: `${pkg.type}`,
                                    message: { user },
                                }));
                            }
                            else if (results.length === 0) {
                                const addUserToSql = `insert into User (userName, userPoint) values ('${userName}', ${user.userPoint})`;
                                dbConnection.query(addUserToSql, (insertResults) => {
                                    const insertObj = JSON.parse(JSON.stringify(insertResults));
                                    console.log(JSON.stringify(insertResults));
                                    console.log(insertObj.insertId);
                                    user.userID = insertObj.insertId;
                                    this.usersMap.set(userName, user);
                                    game.setUser(user);
                                    game.ws.send(JSON.stringify({
                                        type: `${pkg.type}`,
                                        message: { user },
                                    }));
                                });
                            }
                        });
                    }
                    break;
                case 'Logout':
                    {
                        const user = pkg.message;
                        if (user.userID === game.user.userID) {
                            const updateUserToSql = `UPDATE User SET userPoint = ${game.user.userPoint} WHERE userID = ${user.userID}`;
                            console.log(`updateUserToSql: ${updateUserToSql}`);
                            dbConnection.query(updateUserToSql, () => {});
                        }
                    }
                    break;
                default:
                    game.dealC2S(data, this);
                    break;
            }
        }
    },
};
