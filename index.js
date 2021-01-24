
const ROWS = 5;

function createBoard(columns) {
    const board = [];
    for (let col = 0; col < columns; col++) {
        for (let row = 0; row < ROWS; row++) {
                board.push(0);
        }
    }
    return {
        board,
        columns
    };
}

function setBoard(board, col, row, value) {
    if (row >= ROWS) {
        throw `row ${row} is out of range`;
    }
    if (col >= board.columns) {
        throw `board has ${board.columns} columns - ${col} is out of range`;
    }
    const index = ROWS * col + row;
    board.board[index] = value;
}

function printBoard(state) {
    const { board, columns } = state;

    let output = '';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < columns; col++) {
            const index = ROWS * col + row;
            output += `${board[index]}`

            if (col < columns - 1) {
                output += ' ';
            }
        }
        output += '\n';
    }

    console.log(output);
}

function createPenta(pentaNumber, cols, str) {
    const penta = [];
    const rows = str.length / cols;

    let strIndex = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const pentaIndex = col * rows + row;
            penta[pentaIndex] = str[strIndex] == ' ' ? 0 : pentaNumber;
            strIndex++;
        }
    }

    return { penta, rows, cols };
}

/**
 * # #  ==> # # # #  ==>    #  ==> #      
 * #    ==>       #  ==>    #  ==> # # # #
 * #                        #             
 * #                      # #             
 * 
 * 0 4      0 2 4 6      [0] 4     0[2 4 6]
 * 1[5]    [1 3 5]7      [1] 5     1 3 5 6 
 * 2[6]                  [2] 6             
 * 3[7]                   3  7             
 */
function rotatePenta90(penta) {
    const penta90 = [];

    const rows90 = penta.cols;
    const cols90 = penta.rows;

    for (let col = 0; col < penta.cols; col++) {
        for (let row = penta.rows - 1; row >= 0; row--) {

            const col90 = penta.rows - row - 1;
            const row90 = col;
            const index90 = col90 * rows90 + row90;

            const index = col * penta.rows + row;
            penta90[index90] = penta.penta[index];
        }
    }

    return { penta: penta90, cols: cols90, rows: rows90 };
}

/**
 * # #  ==> # #    #        ==>       #  
 * #    ==>   #    # # # #  ==> # # # # 
 * #    ==>   #      
 * #    ==>   #      
 * 
 *   # #  ==> # #
 * # #    ==>   # #
 * #      ==>     #
 * 
 * 0 4      0  4 
 * 1[5]    [1] 5
 * 2[6]    [2] 6
 * 3[7]    [3] 7
 */
function mirrowPenta(penta) {
    const pentaM = [];
    const { rows, cols } = penta;

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const colM = cols - col - 1;
            const indexM = colM * rows + row;

            const index = col * rows + row;
            pentaM[indexM] = penta.penta[index];
        }
    }

    return { penta: pentaM, rows, cols }
}

const board = createBoard(3)

const pentas = [
    [],
    [1],
    createPenta(2,
        2,
        '**' +
        '* ' +
        '* ' +
        '* '
    ),
    createPenta(3,
        4,
        ' *  ' +
        '****'
    ),
    [4],
    [5],
    [6],
    [7],
    [8],
    [9],
    createPenta(10,
        3,
        '***' +
        ' * ' +
        ' * '
    ),
];

const m = mirrowPenta(pentas[3]);

function solve(pentas, pentasIndecies) {
    return 4;
}

const solution = solve(pentas, [2, 3, 4]);
console.log(solution);

//printBoard(board);
