
module.exports = function WinLose() {
    this.symbolIndexList = [];
    this.symbolWinLoseList = [];
    this.symbolOddsList = [];

    /**
     * 設定每個 Symbol Index 資訊
     * @param {Integer} indexCounts symbol index 數量
     */
    this.setSymbolIndexList = function setSymbolIndexList(indexCounts) {
        for (let i = 0; i < indexCounts; i += 1) {
            this.symbolIndexList.push(i);
        }

        this.symbolWinLoseList = this.symbolIndexList.map(value => ({
            index: value,
            isWin: false,
            positions: [],
            winScore: 0,
        }));
    };

    /**
     * 設定賠率表資訊
     * @param {Array} odds 賠率表
     */
    this.setSymbolOddsList = function setSymbolOddsList(odds) {
        this.symbolOddsList = odds;
    };

    /**
     * 初始 WinLose 設定
     * @param {Integer} indexCounts symbol index 數量
     * @param {Array} odds 賠率表
     */
    this.initWinLose = function initWinLose(indexCounts, odds) {
        this.setSymbolIndexList(indexCounts);
        this.setSymbolOddsList(odds);
    };

    /**
     * Reset WinLose 設定
     */
    this.resetSymbolWinLoseList = function resetSymbolWinLoseList() {
        this.symbolWinLoseList = this.symbolIndexList.map(value => ({
            index: value,
            isWin: false,
            positions: [],
            winScore: 0,
        }));
    };

    /**
     * 取得以行為序的陣列
     * @param {Array} symbolResult 盤面
     * @param {Integer} symbolRow 行數
     */
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

    /**
     * 設定此次盤面的輸贏資訊
     * @param {Integer} totalBet 押注
     * @param {Array} symbolResult 盤面
     * @param {Integer} symbolRow 行數
     */
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
        // console.log(`winSymbolIndexList:${winSymbolIndexList}`);

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
        // console.log(`winSymbolIndexList:${JSON.stringify(this.symbolWinLoseList)}`);
    };

    /**
     * 取得盤面的總贏分
     */
    this.getTotalWin = function getTotalWin() {
        let totalWin = 0;
        this.symbolWinLoseList.forEach((symbol) => {
            if (symbol.isWin) {
                totalWin += symbol.winScore;
            }
        });
        return totalWin;
    };

    /**
     * 取得盤面有中的 Symbol 位置
     * @param {Integer} symbolRow 行數 (預設 0)
     */
    this.getWinPositions = function getWinPositions(symbolRow = 0) {
        let winPositions = [];
        this.symbolWinLoseList.forEach((symbol) => {
            if (symbol.isWin) {
                winPositions = winPositions.concat(symbol.positions);
            }
        });

        winPositions = winPositions.map(val => val + symbolRow);
        return winPositions;
    };
};
