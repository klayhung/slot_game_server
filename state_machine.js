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
            onReady(lifecycle, game) {
                console.log(`current state : ${lifecycle.to}`);
                const symbolCounts = game.symbolRow * game.symbolColumn;
                const symbolIndexCounts = game.symbolName.SN_COUNT;
                const symbolsResult = [];
                for (let i = 0; i < symbolCounts; i += 1) {
                    const rand = Math.floor(Math.random() * Math.floor(symbolIndexCounts));
                    symbolsResult.push(rand);
                }
                const S2C_Init = {
                    type: 'GameInit',
                    message: {
                        odds: game.symbolOddsList,
                        symbols: symbolsResult,
                    },
                };
                console.log(`symbolsResult: ${symbolsResult}`);
                game.sendS2C(S2C_Init);
            },

            onSpin() {
                console.log(`current state : ${this.stateMachine.state}`);
            },

            onSpinWin() {
                console.log(`current state : ${this.stateMachine.state}`);
            },

            onEndAnimen() {
                console.log(`current state : ${this.stateMachine.state}`);
            },

            onSpinNoWin() {
                console.log(`current state : ${this.stateMachine.state}`);
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
