const User = require('./user');
const dbConnection = require('./db_connect');

module.exports = {
    usersMap: new Map(),

    init() {
        dbConnection.connect();
    },

    getUser(userName) {
        return this.gamesMap.get(userName);
    },

    receiveClientPackage(wsID, data) {
        const pkg = JSON.parse(data);
        switch (pkg.name) {
            case 'Login':
                {
                    const userName = pkg.message.userName;
                    let user = new User();
                    dbConnection.query(`select * from User where userName = "${userName}"`, (results) => {
                        if (results.length === 1) {
                            user = JSON.parse(JSON.stringify(results[0]));
                            this.usersMap.set(userName, user);
                        }
                        else if (results.length === 0) {
                            const addUserToSql = `insert into User (userName, userPoint) values ('${userName}', ${user.userPoint})`;
                            dbConnection.query(addUserToSql, (insertResults) => {
                                const insertObj = JSON.parse(JSON.stringify(insertResults));
                                console.log(JSON.stringify(insertResults));
                                console.log(insertObj.insertId);
                                user.userID = insertObj.insertId;
                                this.usersMap.set(userName, user);
                            });
                        }
                    });
                }
                break;
            case 'Logout':
                {
                    const user = pkg.message;
                    const updateUserToSql = `UPDATE User SET userPoint = ${user.userPoint} WHERE userID = ${user.userID}`;
                    console.log(`updateUserToSql: ${updateUserToSql}`);
                    dbConnection.query(updateUserToSql, () => {});
                }
                break;
            default:
                break;
        }
    },
};
