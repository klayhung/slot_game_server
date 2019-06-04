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

    this.dealC2S = function dealC2S(data) {
        console.log(`game receive : ${data}`);
        const pkg = JSON.parse(data);
        switch (pkg.type) {
            case 'GameInit':
                this.fsm.ready(this, pkg);
                break;
            case 'SlotSpin':
                this.fsm.spin(this, pkg);
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

    this.resetSymbolWinLoseList = function resetSymbolWinLoseList() {
        this.symbolWinLoseList = this.symbolIndexList.map((value, index) => ({
            index: value,
            isWin: false,
            positions: [],
            winScore: 0,
        }));
    };

    this.getSymbolPosOfRowList = function getSymbolPosOfRowList(symbolResult, symbolRow) {
        const fisrtRowSymbolPosList = [];
        const symbolPosOfRowList = [];

        /** 取得第一行位置 */
        symbolResult.forEach((value, index) => {
            if (index === 0 || index % symbolRow === 0) {
                fisrtRowSymbolPosList.push(index);
            }
        });

        /** 取得以行排序的位置 */
        for (let j = 0; j < symbolRow; j += 1) {
            symbolPosOfRowList.push(fisrtRowSymbolPosList.map(val => val + j));
        }

        return symbolPosOfRowList;
    };

    this.setWinLose = function setWinLose(totalBet, symbolResult, symbolRow) {
        this.resetSymbolWinLoseList();
        const symbolPosOfRowList = this.getSymbolPosOfRowList(symbolResult, symbolRow);
        const winSymbolIndexList = this.symbolIndexList.filter((value) => {
            let rowCounts = 0;
            symbolPosOfRowList.forEach((positions) => {
                const result = positions.find(pos => symbolResult[pos] === value);
                if (result !== undefined) ++rowCounts;
            });
            return rowCounts === symbolRow;
        });
        console.log(`winSymbolIndexList:${winSymbolIndexList}`);

        this.symbolWinLoseList.forEach((symbol) => {
            if (winSymbolIndexList.includes(symbol.index)) {
                symbol.isWin = true;
                symbolResult.forEach((value, pos) => {
                    if (value === symbol.index) {
                        symbol.positions.push(pos);
                    }
                });

                const symbolCountOfRowList = [];
                symbolPosOfRowList.forEach((positions) => {
                    let countsOfRow = 0;
                    positions.forEach((pos) => {
                        if (symbol.positions.includes(pos)) {
                            ++countsOfRow;
                        }
                    });
                    symbolCountOfRowList.push(countsOfRow);
                });

                const symbolCounts = symbolCountOfRowList.reduce((first, second) => first * second);
                symbol.winScore = totalBet * symbolCounts * this.symbolOddsList[symbol.index];
            }
        });
        console.log(`winSymbolIndexList:${JSON.stringify(this.symbolWinLoseList)}`);
    };
};
