const COLUMNS = 5,
    ROWS = 7,
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
    }),
    mounted() {
        this.fillBoard();
    },
    methods: {
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
            console.log(columnNumber);
            Vue.set(this.board[0], columnNumber - 1, PLAYER_1);
        }
    }
});