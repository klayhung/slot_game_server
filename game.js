const FSM = require('./state_machine');
const WinLose = require('./winlose');

module.exports = function Game() {
    this.gm = {};
    this.user = {};
    this.fsm = {};
    this.winlose = {};
    this.to = 'Game';

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

    /**
     * Game 初始
     */
    this.init = function init(gm) {
        this.gm = gm;
        this.fsm = new FSM().stateMachine;
        this.winlose = new WinLose();
    };

    /**
     * 設定玩家資訊
     * @param {Object} user 玩家物件
     */
    this.setUser = function setUser(user) {
        this.user = user;
        this.credit = user.userPoint;
    };

    /**
     * 更新玩家點數
     */
    this.updateUserPoint = function updateUserPoint() {
        this.user.userPoint = this.credit;
    };

    /**
     * 處理客端來的遊戲封包
     * @param {JSON} data 封包資訊
     */
    this.dealC2S = function dealC2S(pkg) {
        switch (pkg.type) {
            case 'GameInit':
                this.fsm.prepare(this, pkg);
                break;
            case 'SlotSpin':
                this.fsm.spin(this, pkg);
                break;
            default:
                break;
        }
    };

    /**
     * 處理 Server 端來的遊戲封包
     * @param {JSON} data 封包資訊
     */
    this.dealS2S = function dealS2S(pkg) {
        switch (pkg.type) {
            case 'Login':
                this.fsm.ready(this, pkg);
                break;
            case 'Logout':
                this.fsm.leave(this, pkg);
                this.gm.destroyGame(pkg.clientID);
                break;
            default:
                break;
        }
    };

    /**
     * 送出遊戲封包給客端
     * @param {JSON} data 封包資訊
     */
    this.sendS2C = function sendS2C(data) {
        this.gm.sendPackage(data);
    };

    /**
     * 送出遊戲封包給客端
     * @param {JSON} data 封包資訊
     */
    this.sendS2S = function sendS2S(data) {
        this.gm.sendPackage(data);
    };

    /**
     * 取得新的盤面結果
     */
    this.getNextSymbolResult = function getNextSymbolResult() {
        const symbolCounts = this.symbolRow * this.symbolColumn;
        const symbolIndexCounts = this.symbolName.SN_COUNT;
        const symbolsResult = [];
        for (let i = 0; i < symbolCounts; i += 1) {
            const rand = Math.floor(Math.random() * Math.floor(symbolIndexCounts));
            symbolsResult.push(rand);
        }
        console.log(`symbolsResult: ${symbolsResult}`);
        return symbolsResult;
    };
};
