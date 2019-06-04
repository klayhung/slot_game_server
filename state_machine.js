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
            {
                name: 'goto',
                from: '*',
                to(state) {
                    return state;
                },
            },
        ],

        methods: {
            onReady(lifecycle, game, pkg) {
                console.log(`current state : ${lifecycle.to}`);
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
                const symbolResult = game.getNextSymbolResult();
                const S2C_Spin = {
                    type: pkg.type,
                    message: {
                        credit: game.credit,
                        symbols: symbolResult,
                    },
                };
                game.sendS2C(S2C_Spin);
            },
        },
    });
};

// module.exports = new StateMachine({
//     init: 'GameInit',
//     transitions: [
//         { name: 'ready', from: 'GameInit', to: 'GameWait' },
//         { name: 'spin', from: 'GameWait', to: 'GameSpin' },
//         { name: 'spinWin', from: 'GameSpin', to: 'GameWinAnime' },
//         { name: 'spinNoWin', from: 'GameSpin', to: 'GameWait' },
//         { name: 'endAnime', from: 'GameWinAnime', to: 'GameWait' },
//         {
//             name: 'goto',
//             from: '*',
//             to(state) {
//                 return state;
//             },
//         },
//     ],

//     methods: {
//         onReady() {
//         },

//         onSpin() {
//         },

//         onSpinWin() {
//         },

//         onEndAnimen() {
//         },

//         onSpinNoWin() {
//         },
//     },
// });


// console.log(fsm.state);
// fsm.ready();
// console.log(fsm.state);
// fsm.spin();
// console.log(fsm.state);
// fsm.spinWin();
// console.log(fsm.state);
// fsm.goto('GameWait');
// console.log(fsm.state);
