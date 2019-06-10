const WinLose = require('../winlose');


test('check_symbolWinLoseList_array', () => {
    const winlose = new WinLose();
    const count = 2;
    const expectSymbolWinLoseList = [];
    for (let i = 0; i < count; i += 1) {
        expectSymbolWinLoseList.push({
            index: i,
            isWin: false,
            positions: [],
            winScore: 0,
        });
    }

    winlose.setSymbolIndexList(count);
    expect(winlose.symbolWinLoseList).toEqual(expectSymbolWinLoseList);
});

test('check_initWinLose_function', () => {
    const winlose = new WinLose();
    const count = 2;
    const expectSymbolOddsList = [1, 2, 3, 4, 5];
    const expectSymbolWinLoseList = [];
    for (let i = 0; i < count; i += 1) {
        expectSymbolWinLoseList.push({
            index: i,
            isWin: false,
            positions: [],
            winScore: 0,
        });
    }

    winlose.initWinLose(count, expectSymbolOddsList);

    expect(winlose.symbolWinLoseList).toEqual(expectSymbolWinLoseList);
    expect(winlose.symbolOddsList).toEqual(expectSymbolOddsList);
});

test('check_resetSymbolWinLoseList_function', () => {
    const winlose = new WinLose();
    const count = 5;
    const expectSymbolWinLoseList = [];
    for (let i = 0; i < count; i += 1) {
        expectSymbolWinLoseList.push({
            index: i,
            isWin: false,
            positions: [],
            winScore: 0,
        });
    }

    winlose.setSymbolIndexList(count);
    winlose.resetSymbolWinLoseList();
    expect(winlose.symbolWinLoseList).toEqual(expectSymbolWinLoseList);
});

test('check_3x3_symbolPosOfRow', () => {
    const winlose = new WinLose();
    const symbolResult = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
    ];
    const symbolRow = 3;
    const expectSymbolPosOfRowList = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
    expect(winlose.getSymbolPosOfRowList(symbolResult, symbolRow))
        .toEqual(expectSymbolPosOfRowList);
});

test('check_3x5_symbolPosOfRow', () => {
    const winlose = new WinLose();
    const symbolResult = [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
    ];
    const symbolRow = 5;
    const expectSymbolPosOfRowList = [[0, 5, 10], [1, 6, 11], [2, 7, 12], [3, 8, 13], [4, 9, 14]];
    expect(winlose.getSymbolPosOfRowList(symbolResult, symbolRow))
        .toEqual(expectSymbolPosOfRowList);
});

describe('check_noWin', () => {
    const winlose = new WinLose();
    const symbolOddsList = [1, 2, 3, 4, 5];
    const totalBet = 100;
    const symbolResult = [
        0, 1, 2,
        0, 1, 2,
        0, 1, 2,
    ];
    const symbolRow = 3;
    const count = 5;
    const expectSymbolWinLoseList = [];

    for (let i = 0; i < count; i += 1) {
        expectSymbolWinLoseList.push({
            index: i,
            isWin: false,
            positions: [],
            winScore: 0,
        });
    }

    winlose.initWinLose(count, symbolOddsList);
    winlose.setWinLose(totalBet, symbolResult, symbolRow);

    test('symbolWinLoseList', () => {
        expect(winlose.symbolWinLoseList).toEqual(expectSymbolWinLoseList);
    });

    test('totalWin_is_0', () => {
        expect(winlose.getTotalWin()).toBe(0);
    });

    test('pos_is_empty', () => {
        expect(winlose.getWinPositions()).toEqual([]);
    });
});

describe('check_symbol_0_win_1_count', () => {
    const winlose = new WinLose();
    const symbolOddsList = [1, 2, 3, 4, 5];
    const totalBet = 100;
    const symbolResult = [
        4, 1, 3,
        3, 0, 2,
        0, 1, 0,
    ];
    const symbolRow = 3;
    const count = 5;
    const expectSymbolWinLoseList = [];

    expectSymbolWinLoseList.push({
        index: 0,
        isWin: true,
        positions: [4, 6, 8],
        winScore: totalBet * symbolOddsList[0] * 1,
    });
    for (let i = 1; i < count; i += 1) {
        expectSymbolWinLoseList.push({
            index: i,
            isWin: false,
            positions: [],
            winScore: 0,
        });
    }

    winlose.initWinLose(count, symbolOddsList);
    winlose.setWinLose(totalBet, symbolResult, symbolRow);

    test('symbolWinLoseList', () => {
        expect(winlose.symbolWinLoseList).toEqual(expectSymbolWinLoseList);
    });

    test('totalWin_is_100', () => {
        expect(winlose.getTotalWin()).toBe(100);
    });

    test('pos_is_[4, 6, 8]', () => {
        expect(winlose.getWinPositions()).toEqual([4, 6, 8]);
    });
});

describe('check_symbol_0_win_4_count', () => {
    const winlose = new WinLose();
    const symbolOddsList = [1, 2, 3, 4, 5];
    const totalBet = 100;
    const symbolResult = [
        0, 1, 0,
        3, 0, 2,
        0, 1, 0,
    ];
    const symbolRow = 3;
    const count = 5;
    const expectSymbolWinLoseList = [];

    expectSymbolWinLoseList.push({
        index: 0,
        isWin: true,
        positions: [0, 2, 4, 6, 8],
        winScore: totalBet * symbolOddsList[0] * 4,
    });
    for (let i = 1; i < count; i += 1) {
        expectSymbolWinLoseList.push({
            index: i,
            isWin: false,
            positions: [],
            winScore: 0,
        });
    }

    winlose.initWinLose(count, symbolOddsList);
    winlose.setWinLose(totalBet, symbolResult, symbolRow);

    test('symbolWinLoseList', () => {
        expect(winlose.symbolWinLoseList).toEqual(expectSymbolWinLoseList);
    });

    test('totalWin_is_400', () => {
        expect(winlose.getTotalWin()).toBe(400);
    });

    test('pos_is_[0, 2, 4, 6, 8]', () => {
        expect(winlose.getWinPositions()).toEqual([0, 2, 4, 6, 8]);
    });
});

describe('check_symbol_0_and_4_each_win_1_count', () => {
    const winlose = new WinLose();
    const symbolOddsList = [1, 2, 3, 4, 5];
    const totalBet = 100;
    const symbolResult = [
        2, 1, 2,
        4, 0, 4,
        0, 4, 0,
    ];
    const symbolRow = 3;
    const count = 5;
    const expectSymbolWinLoseList = [];
    expectSymbolWinLoseList.push({
        index: 0,
        isWin: true,
        positions: [4, 6, 8],
        winScore: totalBet * symbolOddsList[0] * 1,
    });
    for (let i = 1; i < count - 1; i += 1) {
        expectSymbolWinLoseList.push({
            index: i,
            isWin: false,
            positions: [],
            winScore: 0,
        });
    }
    expectSymbolWinLoseList.push({
        index: 4,
        isWin: true,
        positions: [3, 5, 7],
        winScore: totalBet * symbolOddsList[4] * 1,
    });

    winlose.initWinLose(count, symbolOddsList);
    winlose.setWinLose(totalBet, symbolResult, symbolRow);

    test('symbolWinLoseList', () => {
        expect(winlose.symbolWinLoseList).toEqual(expectSymbolWinLoseList);
    });

    test('totalWin_is_600', () => {
        expect(winlose.getTotalWin()).toBe(600);
    });

    test('pos_is_[4, 6, 8, 3, 5, 7]', () => {
        expect(winlose.getWinPositions()).toEqual([4, 6, 8, 3, 5, 7]);
    });
});
