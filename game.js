
module.exports = function Game() {
    this.gameID = 0;
    this.users = {};
    this.ws = {};
    this.totalBet = 0;
    this.credit = 0;
    this.symbolOddsList = [0.1, 0.2, 0.3, 0.4, 0.5];

    this.init = function init(ws, gm) {
        this.gameID = ++gm.gameIDCounter;
        this.ws = ws;
        this.credit = gm.userCredit;
    };

    this.dealC2S = function dealC2S(data, gm) {
        console.log(`game ${this.gameID} receive : ${data}`);
        const pkg = JSON.parse(data);
        switch (pkg.type) {
            case 'Login':
                {
                    const userName = pkg.message.userName;
                    if (gm.userNameList.includes(userName)) {
                        const userInfo = gm.userInfoMap.get(userName);
                        this.ws.send(JSON.stringify({
                            type: `${pkg.type}`,
                            message: { userInfo },
                        }));
                        console.log(`exist userInfo :${JSON.stringify(userInfo)}`);
                    }
                    else {
                        ++gm.userCounts;
                        const userInfo = {
                            userID: gm.userCounts,
                            userName,
                            userCredit: this.credit,
                        };
                        gm.userNameList.push(userName);
                        gm.userInfoList.push(userInfo);
                        gm.userInfoMap.set(userName, userInfo);
                        this.ws.send(JSON.stringify({
                            type: `${pkg.type}`,
                            message: { userInfo },
                        }));
                        console.log(`new userInfo :${JSON.stringify(userInfo)}`);
                    }
                }
                break;
            case 'GameInit':
                {
                    /** Symbol 數量 */
                    const symbolCounts = pkg.message.symbolCounts;
                    /** Symbol Index */
                    const symbolIndexCounts = pkg.message.symbolIndexCounts;
                    /** Symbol 陣列 (亂數) */
                    const symbolsResult = [];
                    for (let i = 0; i < symbolCounts; i += 1) {
                        const rand = Math.floor(Math.random() * Math.floor(symbolIndexCounts));
                        symbolsResult.push(rand);
                    }
                    console.log(`symbolsResult: ${symbolsResult}`);
                    this.ws.send(JSON.stringify({
                        type: `${pkg.type}`,
                        message: {
                            odds: this.symbolOddsList,
                            symbols: symbolsResult,
                        },
                    }));
                }
                break;
            case 'SlotSpin':
                {
                    /** Symbol 數量 */
                    const symbolCounts = pkg.message.symbolCounts;
                    /** Symbol Index */
                    const symbolIndexCounts = pkg.message.symbolIndexCounts;
                    /** Symbol 陣列 (亂數) */
                    const symbolsResult = [];
                    for (let i = 0; i < symbolCounts; i += 1) {
                        const rand = Math.floor(Math.random() * Math.floor(symbolIndexCounts));
                        symbolsResult.push(rand);
                    }
                    console.log(`symbolsResult: ${symbolsResult}`);
                    this.ws.send(JSON.stringify({
                        type: `${pkg.type}`,
                        message: {
                            symbols: symbolsResult,
                        },
                    }));
                }
                break;
            case 'SaveDB':
                /** total bet */
                this.totalBet = pkg.message.totalBet;
                /** Credit */
                this.credit = pkg.message.credit;

                // TODO
                break;
            default:
                break;
        }
    };
};
