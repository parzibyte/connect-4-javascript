const COLUMNS = 8,
    ROWS = 4,
    EMPTY_SPACE = "XD",
    PLAYER_1 = "o",
    PLAYER_2 = "x",
    CONNECT = 4; // <-- Change this and you can play connect 5, connect 3, connect 100 and so on!
new Vue({
    el: "#app",
    data: () => ({
        board: [],
        COLUMNS,
        ROWS,
        PLAYER_1,
        PLAYER_2,
        EMPTY_SPACE,
        currentPlayer: null,
    }),
    mounted() {
        this.fillBoard();
        this.selectPlayer();
    },
    methods: {
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
                    const currentCell = board[x][y];
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
            if (this.currentPlayer === PLAYER_1) {
                this.currentPlayer = PLAYER_2;
            } else {
                this.currentPlayer = PLAYER_1;
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
        makeMove(columnNumber) {
            const columnIndex = columnNumber - 1;
            const firstEmptyRow = this.getFirstEmptyRow(columnIndex);
            if (firstEmptyRow === -1) {
                alert("Cannot make move here, it is full");
                return;
            }
            Vue.set(this.board[firstEmptyRow], columnIndex, this.currentPlayer);
            if (this.isWinner(this.currentPlayer, this.board)) {
                this.showWinner();
            } else if (this.isTie(this.board)) {
                this.showTie();
            } else {
                this.togglePlayer();
            }
        },
        showWinner() {
            if (this.currentPlayer === PLAYER_1) {
                alert("The winner is player 1");
            } else {
                alert("The winner is player 2");
            }
        },
        showTie() {
            alert("Tie!");
        },
        getFirstEmptyRow(columnIndex) {
            for (let i = ROWS - 1; i >= 0; i--) {
                if (this.board[i][columnIndex] === EMPTY_SPACE) {
                    return i;
                }
            }
            return -1;
        }
    }
});