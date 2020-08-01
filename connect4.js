const COLUMNS = 4,
    ROWS = 4,
    EMPTY_SPACE = "XD",
    PLAYER_1 = "o",
    PLAYER_2 = "x";
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
        selectPlayer() {
            //TODO: make random
            this.currentPlayer = PLAYER_1;
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
            this.togglePlayer();
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