const playerOne = '\u2716'
const BOT = '\u25EF'

let ticTacToe;
if (typeof window != 'undefined') {
    window.onload = function () {
        const gridContainer = document.getElementById("tic-tac-toe-grid-container");
        ticTacToe = new TicTacToe(gridContainer);
    };
}


function TicTacToe(grid) {
    this.container = grid;
    this.winner = ""
    this.lastMove = BOT

    this.setCellWin = function (row, column) {
        const element = document.getElementById(row + '_' + column)
        element.setAttribute('class', element.className + ' win')
    }

    this.setRowWin = function (row) {
        this.setCellWin(row, 1)
        this.setCellWin(row, 2)
        this.setCellWin(row, 3)
    }

    this.setColumnWin = function (column) {
        this.setCellWin(1, column)
        this.setCellWin(2, column)
        this.setCellWin(3, column)
    }

    this.getCellValue = function (row, column) {
        console.log(row + '_' + column)
        const element = document.getElementById(row + '_' + column)
        return element.innerText
    }

    this.setCellValue = function (row, column, player) {
        const element = document.getElementById(row + '_' + column).innerText = player
    }

    this.check = function () {
        for (let row = 1; row <= 3; row++) {
            this.checkRow(row, playerOne)
        }
        for (let row = 1; row <= 3; row++) {
            this.checkRow(row, BOT)

        }
        for (let column = 1; column <= 3; column++) {
            this.checkColumn(column, BOT)

        }
        for (let column = 1; column <= 3; column++) {
            this.checkColumn(column, playerOne)
        }
        this.checkLeftDiagonal(BOT);
        this.checkLeftDiagonal(playerOne);
        this.checkRightDiagonal(playerOne);
        this.checkRightDiagonal(BOT);
        // TODO define isAnyWin;
        let isAnyWin = false;
        return isAnyWin;
    }

    this.checkLeftDiagonal = function (player) {
        if (this.getCellValue(1, 1) === player &&
            this.getCellValue(2, 2) === player &&
            this.getCellValue(3, 3) === player) {

            this.setCellWin(1, 1)
            this.setCellWin(2, 2)
            this.setCellWin(3, 3)
            this.winner = player

        }
    }

    this.checkRightDiagonal = function (player) {
        if (this.getCellValue(1, 3) === player &&
            this.getCellValue(2, 2) === player &&
            this.getCellValue(3, 1) === player) {

            this.setCellWin(1, 3)
            this.setCellWin(2, 2)
            this.setCellWin(3, 1)
            this.winner = player
        }
    }

    this.checkRow = function (row, player) {
        if (this.getCellValue(row, 1) === player &&
            this.getCellValue(row, 2) === player &&
            this.getCellValue(row, 3) === player) {

            this.setRowWin(row)
            this.winner = player
        }
    }

    this.checkColumn = function (column, player) {
        if (this.getCellValue(1, column) === player &&
            this.getCellValue(2, column) === player &&
            this.getCellValue(3, column) === player) {

            this.setColumnWin(column)
            this.winner = player
        }
    }

    this.goComputer = function () {
        for (let c = 1; c <= 3; c++) {
            for (let r = 1; r <= 3; r++) {
                if (this.getCellValue(r, c) === '') {
                    let board = this.getBoard()
                    board[r - 1][c - 1] = BOT
                    let result = this.defineScore(board)
                    if (typeof result === "undefined") {
                        result = this.minMaxScore(board,playerOne)
                    }
                    this.setCellValue(r, c, typeof result === 'undefined' ? '"U"' : '"' + result + '"')
                    // if (this.defineScore(board) === 1) {
                    //     this.setCellValue(r, c, BOT)
                    //     this.lastMove = BOT
                    //     return
                    // }
                }
            }
        }
    }

    this.minMaxScore = function (board, player) {
        let result
        let undefinedCells = []
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (board[r][c] === '' || board[r][c].startsWith('"')) {
                    let nextBoard = _.cloneDeep(board)
                    nextBoard[r][c] = player
                    let nextResult = this.defineScore(nextBoard)
                    if (typeof nextResult === 'undefined') {
                        undefinedCells.push({ row: r, column: c })
                        continue
                    }
                    if (player !== BOT) {
                        result = result ? Math.min(result, nextResult) : nextResult
                        if (result === -1) {
                            return -1
                        }
                    } else {
                        result = result ? Math.max(result, nextResult) : nextResult
                        if (result === 1) {
                            return 1
                        }
                    }
                }
            }
        }
        if (undefinedCells.length === 0) {
            return result
        }
        // TODO define all undefined
    }

    this.choose = function (event, element) {
        const position = element.id.split('_')
        console.log("Row:" + position[0] + "Column:" + position[1])
        if (this.winner === '') {
            if (this.lastMove === BOT) {
                element.innerText = playerOne
                this.lastMove = playerOne
            } else {
                element.innerText = BOT
                this.lastMove = BOT

            }
            const isAnyWin = this.check()
            if (this.winner !== '') {
                document.getElementById('Winner').innerText = this.winner + ' Winner'
            }
            if (isAnyWin === false) {
                this.goComputer();
            }
        }
    }

    this.getBoard = function () {
        let board = Array.from(Array(3), () => new Array(3))
        for (let c = 1; c <= 3; c++) {
            for (let r = 1; r <= 3; r++) {
                console.log("r = " + r + " c = " + c)
                board[r - 1][c - 1] = this.getCellValue(r, c)
            }
        }
        return board;
    }

    this.isWin = function (board, player) {
        // Left diagonal
        if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
            return true
        }
        if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
            return true
        }
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
                return true
            }
        }
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
                return true
            }
        }
    }
    this.defineScore = function (board) {
        if (this.isWin(board, BOT)) {
            return 1
        }
        if (this.isWin(board, playerOne)) {
            return -1
        }
        for (let r = 1; r <= 3; r++) {
            for (let c = 1; c <= 3; c++) {
                if (board[r - 1][c - 1] === '') {
                    return undefined
                }
            }
        }
        return 0;
    }
}