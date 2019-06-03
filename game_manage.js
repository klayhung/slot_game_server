const Game = require('./game');
const db_connection = require('./db_connect');

module.exports = {
    gameList: [],
    gameIDCounter: 0,

    userCounts: 0,
    userPoint: 10000,
    userNameList: [],
    userInfoList: [],
    userInfoMap: new Map(),

    init() {
        db_connection.connect();
    },

    createGame(ws) {
        const g = new Game();
        g.init(ws, this);
        this.gameList.push(g);
    },

    receiveClientPackage(wsID, data) {
        this.gameList.forEach((eachGame) => {
            if (eachGame.ws.id === wsID) {
                const pkg = JSON.parse(data);
                switch (pkg.type) {
                    case 'Login':
                        {
                            const userName = pkg.message.userName;
                            let userInfo = {};
                            db_connection.query(`select * from user where user_name = "${userName}"`, (results, fields) => {
                                if (results.length === 1) {
                                    const js = JSON.stringify(results[0]);
                                    userInfo = JSON.parse(js);
                                    this.userInfoMap.set(userName, userInfo);
                                    eachGame.ws.send(JSON.stringify({
                                        type: `${pkg.type}`,
                                        message: { userInfo },
                                    }));
                                }
                                else if (results.length === 0) {
                                    userInfo = {
                                        user_id: -1,
                                        user_name: userName,
                                        user_point: this.userPoint,
                                    };
                                    const addUserToSql = `insert into user (user_name, user_point) values ('${userName}', ${this.userPoint})`;
                                    db_connection.query(addUserToSql, (insertResults, insertFields) => {
                                        const insertObj = JSON.parse(JSON.stringify(insertResults));
                                        console.log(JSON.stringify(insertResults));
                                        console.log(insertObj.insertId);
                                        userInfo.user_id = insertObj.insertId;
                                        this.userInfoMap.set(userName, userInfo);
                                        eachGame.ws.send(JSON.stringify({
                                            type: `${pkg.type}`,
                                            message: { userInfo },
                                        }));
                                    });
                                }
                            });
                        }
                        break;
                    default:
                        eachGame.dealC2S(data, this);
                        break;
                }
            }
        });
    },
};
