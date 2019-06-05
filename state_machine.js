const StateMachine = require('javascript-state-machine');

module.exports = function FSM() {
    this.stateMachine = new StateMachine({
        init: 'GameInit',
        transitions: [
            { name: 'ready', from: 'GameInit', to: 'GameWait' },
            { name: 'spin', from: 'GameWait', to: 'GameSpin' },
            { name: 'spinWin', from: 'GameSpin', to: 'GameWinAnime' },
            { name: 'spinNoWin', from: 'GameSpin', to: 'GameWait' },
            { name: 'endAnime', from: 'GameWinAnime', to: 'GameWait' },
        ],

        methods: {
            onReady(lifecycle, game, pkg) {
                console.log(`current state : ${lifecycle.to}`);

                game.winlose.initWinLose(game.symbolName.SN_COUNT, game.symbolOddsList);

                const S2C_Init = {
                    type: pkg.type,
                    message: {
                        odds: game.symbolOddsList,
                        symbols: game.getNextSymbolResult(),
                    },
                };
                game.sendS2C(S2C_Init);
            },

            onSpin(lifecycle, game, pkg) {
                console.log(`current state : ${lifecycle.to}`);
                game.totalBet = pkg.message.totalBet;
                game.credit -= game.totalBet;
                console.log(`credit : ${game.credit}`);

                const symbolResult = game.getNextSymbolResult();
                game.winlose.setWinLose(game.totalBet, symbolResult, game.symbolRow);
                const totalWin = game.winlose.getTotalWin();
                const S2C_Spin = {
                    type: pkg.type,
                    message: {
                        credit: game.credit,
                        symbols: symbolResult,
                        totalWin,
                    },
                };
                game.sendS2C(S2C_Spin);

                setTimeout(() => {
                    totalWin > 0
                        ? this.spinWin(game, pkg)
                        : this.spinNoWin(game, pkg);
                }, 0);
            },

            onSpinWin(lifecycle, game, pkg) {
                console.log(`current state : ${lifecycle.to}`);

                game.credit += game.winlose.getTotalWin();
                game.updateUserPoint();

                setTimeout(() => {
                    this.endAnime(game, pkg);
                }, 0);
            },

            onSpinNoWin(lifecycle, game, pkg) {
                console.log(`current state : ${lifecycle.to}`);
                game.updateUserPoint();
            },

            onEndAnime(lifecycle, game, pkg) {
                console.log(`current state : ${lifecycle.to}`);
            },
        },
    });
};
