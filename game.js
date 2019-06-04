const FSM = require('./state_machine');

module.exports = function Game() {
    this.users = {};
    this.ws = {};
    this.totalBet = 0;
    this.credit = 0;
    this.symbolName = {
        SN_S1: 0,
        SN_S2: 1,
        SN_S3: 2,
        SN_S4: 3,
        SN_S5: 4,
        SN_COUNT: 5,
    };
    this.symbolOddsList = [0.1, 0.2, 0.3, 0.4, 0.5];
    this.symbolRow = 3;
    this.symbolColumn = 3;
    this.fsm = {};

    this.init = function init(ws, gm) {
        this.ws = ws;
        this.credit = gm.userCredit;
        this.fsm = new FSM().stateMachine;
    };

    this.start = function start() {
        this.fsm.ready(this);
    };

    this.dealC2S = function dealC2S(data) {
        console.log(`game receive : ${data}`);
        const pkg = JSON.parse(data);
        switch (pkg.type) {
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
                    this.fsm.spin(pkg.message);
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

    this.sendS2C = function sendS2C(data) {
        console.log(JSON.stringify(data));
        this.ws.send(JSON.stringify({
            type: data.type,
            message: data.message,
        }));
    };
};
