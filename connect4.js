/*

  ____          _____               _ _           _       
 |  _ \        |  __ \             (_) |         | |      
 | |_) |_   _  | |__) |_ _ _ __ _____| |__  _   _| |_ ___ 
 |  _ <| | | | |  ___/ _` | '__|_  / | '_ \| | | | __/ _ \
 | |_) | |_| | | |  | (_| | |   / /| | |_) | |_| | ||  __/
 |____/ \__, | |_|   \__,_|_|  /___|_|_.__/ \__, |\__\___|
         __/ |                               __/ |        
        |___/                               |___/         
    
____________________________________
/ Si necesitas ayuda, contáctame en \
\ https://parzibyte.me               /
 ------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
Creado por Parzibyte (https://parzibyte.me). Este encabezado debe mantenerse intacto,
excepto si este es un proyecto de un estudiante.
*/
const COLUMNS = 7,
    ROWS = 6,
    EMPTY_SPACE = " ",
    PLAYER_1 = "o",
    PLAYER_2 = "x",
    PLAYER_CPU = PLAYER_2,
    CONNECT = 4; // <-- Change this and you can play connect 5, connect 3, connect 100 and so on!
new Vue({
    el: "#app",
    data: () => ({
        board: [],
        COLUMNS,
        ROWS,
        PLAYER_1,
        PLAYER_2,
        PLAYER_CPU,
        EMPTY_SPACE,
        currentPlayer: null,
        isCpuPlaying: true,
        canPlay: false,
    }),
    async mounted() {
        await Swal.fire(
            'Connect 4 game',
            'Brought to you by parzibyte - https://parzibyte.me',
            'info'
        );
        this.resetGame();
    },
    methods: {
        async resetGame() {
            await this.askUserGameMode();
            this.fillBoard();
            this.selectPlayer();
            this.makeCpuMove();
        },
        async askUserGameMode() {
            this.canPlay = false;
            const result = await Swal.fire({
                title: 'Choose game mode',
                text: "Do you want to play against another player or against CPU?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#fdbf9c',
                cancelButtonColor: '#4A42F3',
                cancelButtonText: 'Me Vs another player',
                confirmButtonText: 'Me Vs CPU'
            });
            this.canPlay = true;
            this.isCpuPlaying = !!result.value;
        },
        countUp(x, y, player, board) {
            let startY = (y - CONNECT >= 0) ? y - CONNECT + 1 : 0;
            let counter = 0;
            for (; startY <= y; startY++) {
                if (board[startY][x] === player) {
                    counter++;
                } else {
                    counter = 0;
                }
            }
            return counter;
        },
        countRight(x, y, player, board) {
            let endX = (x + CONNECT < COLUMNS) ? x + CONNECT - 1 : COLUMNS - 1;
            let counter = 0;
            for (; x <= endX; x++) {
                if (board[y][x] === player) {
                    counter++;
                } else {
                    counter = 0;
                }
            }
            return counter;
        },
        countUpRight(x, y, player, board) {
            let endX = (x + CONNECT < COLUMNS) ? x + CONNECT - 1 : COLUMNS - 1;
            let startY = (y - CONNECT >= 0) ? y - CONNECT + 1 : 0;
            let counter = 0;
            while (x <= endX && startY <= y) {
                if (board[y][x] === player) {
                    counter++;
                } else {
                    counter = 0;
                }
                x++;
                y--;
            }
            return counter;
        },
        countDownRight(x, y, player, board) {
            let endX = (x + CONNECT < COLUMNS) ? x + CONNECT - 1 : COLUMNS - 1;
            let endY = (y + CONNECT < ROWS) ? y + CONNECT - 1 : ROWS - 1;
            let counter = 0;
            while (x <= endX && y <= endY) {
                if (board[y][x] === player) {
                    counter++;
                } else {
                    counter = 0;
                }
                x++;
                y++;
            }
            return counter;
        },
        isWinner(player, board) {
            for (let y = 0; y < ROWS; y++) {
                for (let x = 0; x < COLUMNS; x++) {
                    let count = 0;
                    count = this.countUp(x, y, player, board);
                    if (count >= CONNECT) return true;
                    count = this.countRight(x, y, player, board);
                    if (count >= CONNECT) return true;
                    count = this.countUpRight(x, y, player, board);
                    if (count >= CONNECT) return true;
                    count = this.countDownRight(x, y, player, board);
                    if (count >= CONNECT) return true;
                }
            }
            return false;
        },
        isTie(board) {
            for (let y = 0; y < ROWS; y++) {
                for (let x = 0; x < COLUMNS; x++) {
                    const currentCell = board[y][x];
                    if (currentCell === EMPTY_SPACE) {
                        return false;
                    }
                }
            }
            return true;
        },
        getRandomNumberBetween(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        selectPlayer() {
            if (this.getRandomNumberBetween(0, 1) === 0) {
                this.currentPlayer = PLAYER_1;
            } else {
                this.currentPlayer = PLAYER_2;
            }
        },
        togglePlayer() {
            this.currentPlayer = this.getAdversary(this.currentPlayer);
        },
        getAdversary(player) {
            if (player === PLAYER_1) {
                return PLAYER_2;
            } else {
                return PLAYER_1;
            }
        },
        fillBoard() {
            this.board = [];
            for (let i = 0; i < ROWS; i++) {
                this.board.push([]);
                for (let j = 0; j < COLUMNS; j++) {
                    this.board[i].push(EMPTY_SPACE);
                }
            }
        },
        cellImage(cell) {
            if (cell === this.PLAYER_1) {
                return "img/player1.png";
            } else if (cell === this.PLAYER_2) {
                return "img/player2.png";
            } else {
                return "img/empty.png"
            }
        },
        async makeMove(columnNumber) {
            const columnIndex = columnNumber - 1;
            const firstEmptyRow = this.getFirstEmptyRow(columnIndex, this.board);
            if (firstEmptyRow === -1) {
                Swal.fire('Cannot put here, it is full');
                return;
            }
            Vue.set(this.board[firstEmptyRow], columnIndex, this.currentPlayer);
            const status = await this.checkGameStatus();
            if (!status) {
                this.togglePlayer();
                this.makeCpuMove();
            } else {
                this.askUserForAnotherMatch();
            }
        },
        // Returns true if there's a winner or a tie. False otherwise
        async checkGameStatus() {
            if (this.isWinner(this.currentPlayer, this.board)) {
                await this.showWinner();
                return true;
            } else if (this.isTie(this.board)) {
                await this.showTie();
                return true;
            }
            return false;
        },
        async askUserForAnotherMatch() {
            this.canPlay = false;
            const result = await Swal.fire({
                title: 'Play again?',
                text: "Do you want to play again?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#fdbf9c',
                cancelButtonColor: '#4A42F3',
                cancelButtonText: 'No',
                confirmButtonText: 'Yes'
            });
            if (result.value) {
                this.resetGame();
            }
        },
        async makeCpuMove() {
            if (!this.isCpuPlaying || this.currentPlayer !== PLAYER_CPU) {
                return;
            }
            const bestColumn = this.getBestColumnForCpu();
            const firstEmptyRow = this.getFirstEmptyRow(bestColumn, this.board);
            console.log({ firstEmptyRow });
            Vue.set(this.board[firstEmptyRow], bestColumn, this.currentPlayer);
            const status = await this.checkGameStatus();
            if (!status) {
                this.togglePlayer();
            } else {
                this.askUserForAnotherMatch();
            }
        },
        getBestColumnForCpu() {
            const winnerColumn = this.getWinnerColumn(this.board, this.currentPlayer);
            if (winnerColumn !== -1) {
                console.log("Cpu chooses winner column");
                return winnerColumn;
            }
            // Check if adversary wins in the next move, if so, we take it
            const adversary = this.getAdversary(this.currentPlayer);

            const winnerColumnForAdversary = this.getWinnerColumn(this.board, adversary);
            if (winnerColumnForAdversary !== -1) {
                console.log("Cpu chooses take adversary's victory");
                return winnerColumnForAdversary;
            }
            const cpuStats = this.getColumnWithHighestScore(this.currentPlayer, this.board);
            const adversaryStats = this.getColumnWithHighestScore(adversary, this.board);
            console.log({ adversaryStats });
            console.log({ cpuStats });
            if (adversaryStats.highestCount > cpuStats.highestCount) {
                console.log("CPU chooses take adversary highest score");
                // We take the adversary's best move if it is higher than CPU's
                return adversaryStats.columnIndex;
            } else if (cpuStats.highestCount > 1) {
                console.log("CPU chooses highest count");
                return cpuStats.columnIndex;
            }
            const centralColumn = this.getCentralColumn(this.board);
            if (centralColumn !== -1) {
                console.log("CPU Chooses central column");
                return centralColumn;
            }
            // Finally we return a random column
            console.log("CPU chooses random column");
            return this.getRandomColumn(this.board);

        },
        getWinnerColumn(board, player) {
            for (let i = 0; i < COLUMNS; i++) {
                const boardClone = JSON.parse(JSON.stringify(board));
                const firstEmptyRow = this.getFirstEmptyRow(i, boardClone);
                //Proceed only if row is ok
                if (firstEmptyRow !== -1) {
                    boardClone[firstEmptyRow][i] = player;

                    // If this is winner, return the column
                    if (this.isWinner(player, boardClone)) {
                        return i;
                    }
                }
            }
            return -1;
        },
        getColumnWithHighestScore(player, board) {
            const returnObject = {
                highestCount: -1,
                columnIndex: -1,
            };
            for (let i = 0; i < COLUMNS; i++) {
                const boardClone = JSON.parse(JSON.stringify(board));
                const firstEmptyRow = this.getFirstEmptyRow(i, boardClone);
                if (firstEmptyRow !== -1) {
                    boardClone[firstEmptyRow][i] = player;
                    const firstFilledRow = this.getFirstFilledRow(i, boardClone);
                    if (firstFilledRow !== -1) {
                        let count = 0;
                        count = this.countUp(i, firstFilledRow, player, boardClone);
                        if (count > returnObject.highestCount) {
                            returnObject.highestCount = count;
                            returnObject.columnIndex = i;
                        }
                        count = this.countRight(i, firstFilledRow, player, boardClone);
                        if (count > returnObject.highestCount) {
                            returnObject.highestCount = count;
                            returnObject.columnIndex = i;
                        }
                        count = this.countUpRight(i, firstFilledRow, player, boardClone);
                        if (count > returnObject.highestCount) {
                            returnObject.highestCount = count;
                            returnObject.columnIndex = i;
                        }
                        count = this.countDownRight(i, firstFilledRow, player, boardClone);
                        if (count > returnObject.highestCount) {
                            returnObject.highestCount = count;
                            returnObject.columnIndex = i;
                        }
                    }
                }
            }
            return returnObject;
        },
        getRandomColumn(board) {
            while (true) {
                const boardClone = JSON.parse(JSON.stringify(board));
                const randomColumnIndex = this.getRandomNumberBetween(0, COLUMNS - 1);
                const firstEmptyRow = this.getFirstEmptyRow(randomColumnIndex, boardClone);
                if (firstEmptyRow !== -1) {
                    return randomColumnIndex;
                }
            }
        },
        getCentralColumn(board) {
            const boardClone = JSON.parse(JSON.stringify(board));
            const centralColumn = parseInt((COLUMNS - 1) / 2);
            if (this.getFirstEmptyRow(centralColumn, boardClone) !== -1) {

                return centralColumn;
            }
            return -1;
        },
        async showWinner() {
            if (this.currentPlayer === PLAYER_1) {
                await Swal.fire('Winner is player 1');
            } else {
                await Swal.fire('Winner is player 2');
            }
        },
        async showTie() {
            await Swal.fire('Tie');
        },
        getFirstFilledRow(columnIndex, board) {
            for (let i = ROWS - 1; i >= 0; i--) {
                if (board[i][columnIndex] !== EMPTY_SPACE) {
                    return i;
                }
            }
            return -1;
        },
        getFirstEmptyRow(columnIndex, board) {
            for (let i = ROWS - 1; i >= 0; i--) {
                if (board[i][columnIndex] === EMPTY_SPACE) {
                    return i;
                }
            }
            return -1;
        }
    }
});