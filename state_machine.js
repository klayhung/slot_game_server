const StateMachine = require('javascript-state-machine');

module.exports = function FSM() {
    this.stateMachine = new StateMachine({
        init: 'GameDefault',
        transitions: [
            { name: 'prepare', from: 'GameDefault', to: 'GameInit' },
            { name: 'ready', from: 'GameInit', to: 'GameWait' },
            { name: 'spin', from: 'GameWait', to: 'GameSpin' },
            { name: 'spinWin', from: 'GameSpin', to: 'GameWinAnime' },
            { name: 'spinNoWin', from: 'GameSpin', to: 'GameWait' },
            { name: 'endAnime', from: 'GameWinAnime', to: 'GameWait' },
            { name: 'leave', from: '*', to: 'GameDefault' },
        ],

        methods: {
            /**
             * Game Prepare transition
             * @param {Object} lifecycle
             * @param {Object} game
             * @param {Object} pkg
             */
            onPrepare(lifecycle, game, pkg) {
                console.log(`current state : ${lifecycle.to}`);

                const Login = {
                    type: 'Login',
                    from: game.to,
                    to: 'User',
                    message: { userName: pkg.message.userName },
                    clientID: pkg.clientID,
                };
                game.sendS2S(Login);
            },

            /**
             * Game Ready transition
             * @param {Object} lifecycle
             * @param {Object} game
             * @param {Object} pkg
             */
            onReady(lifecycle, game, pkg) {
                console.log(`current state : ${lifecycle.to}`);

                game.setUser(pkg.message.user);
                game.winlose.initWinLose(game.symbolName.SN_COUNT, game.symbolOddsList);

                const S2C_Init = {
                    type: 'GameInit',
                    from: game.to,
                    to: 'Client',
                    message: {
                        odds: game.symbolOddsList,
                        symbols: game.getNextSymbolResult(),
                    },
                    clientID: pkg.clientID,
                };
                game.sendS2C(S2C_Init);
            },

            /**
             * 玩家 Spin transition
             * @param {Object} lifecycle
             * @param {Object} game
             * @param {Object} pkg
             */
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
                    from: game.to,
                    to: pkg.from,
                    message: {
                        credit: game.credit,
                        symbols: symbolResult,
                        totalWin,
                    },
                    clientID: pkg.clientID,
                };
                game.sendS2C(S2C_Spin);

                setTimeout(() => {
                    totalWin > 0
                        ? this.spinWin(game, pkg)
                        : this.spinNoWin(game, pkg);
                }, 0);
            },

            /**
             * 玩家 Spin 有贏分 transition
             * @param {Object} lifecycle
             * @param {Object} game
             * @param {Object} pkg
             */
            onSpinWin(lifecycle, game, pkg) {
                console.log(`current state : ${lifecycle.to}`);

                game.credit += game.winlose.getTotalWin();
                game.updateUserPoint();

                setTimeout(() => {
                    this.endAnime(game, pkg);
                }, 0);
            },

            /**
             * 玩家 Spin 沒有贏分 transition
             * @param {Object} lifecycle
             * @param {Object} game
             * @param {Object} pkg
             */
            onSpinNoWin(lifecycle, game, pkg) {
                console.log(`current state : ${lifecycle.to}`);
                game.updateUserPoint();
            },

            /**
             * 贏分 transition
             * @param {Object} lifecycle
             * @param {Object} game
             * @param {Object} pkg
             */
            onEndAnime(lifecycle, game, pkg) {
                console.log(`current state : ${lifecycle.to}`);
            },

            /**
             * 離開遊戲 transition
             * @param {Object} lifecycle
             * @param {Object} game
             * @param {Object} pkg
             */
            onLeave(lifecycle, game, pkg) {
                console.log(`current state : ${lifecycle.to}`);

                const LeaveGame = {
                    type: pkg.type,
                    from: game.to,
                    to: 'User',
                    message: { user: game.user },
                    clientID: pkg.clientID,
                };
                game.sendS2S(LeaveGame);
            },
        },
    });
};
