
const ROWS = 5;

function createBoard(columns) {
    const cells = [];
    for (let col = 0; col < columns; col++) {
        for (let row = 0; row < ROWS; row++) {
            cells.push(0);
        }
    }

    return {
        cells,
        columns
    };
}

function copyBoard(board) {
    return {
        cells: board.cells.concat(),
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
    board.cells[index] = value;
}

function getBoardCell(board, col, row) {
    if (row >= ROWS) {
        throw `row ${row} is out of range`;
    }
    if (col >= board.columns) {
        throw `board has ${board.columns} columns - ${col} is out of range`;
    }
    const index = ROWS * col + row;
    return board.cells[index];
}

function canFitOnBoard(board, penta, cellIndex) {
    const cellRow = cellIndex % 5;
    const cellCol = Math.floor(cellIndex / 5);

    const maxRow = cellRow + penta.rows;
    const maxCol = cellCol + penta.cols;

    const isOutOfBoard = (maxRow >= 5 || maxCol >= board.columns);
    if (isOutOfBoard) {
        return false;
    }

    for (let row = 0; row < penta.rows; row++) {
        for (let col = 0; col < penta.cols; col++) {
            const boardCol = cellCol + col;
            const boardRow = cellRow + row;
            
            const index = col * penta.rows + row;
            const value = penta.penta[index];
            
            if (value !== 0 && getBoardCell(board, boardCol, boardRow) !== 0) {
                // board has another piece at this location already.
                return false;
            }
        }
    }

    // all fit check passed
    return true;
}

function addPentaToBoard(board, penta, cellIndex) {
    const cellRow = cellIndex % 5;
    const cellCol = Math.floor(cellIndex / 5);

    for (let row = 0; row < penta.rows; row++) {
        for (let col = 0; col < penta.cols; col++) {
            const index = col * penta.rows + row;
            const value = penta.penta[index];
            setBoard(board, cellCol + col, cellRow + row, value);
        }
    }
}

function removePentaFromBoard(board, penta, cellIndex) {
    const cellRow = cellIndex % 5;
    const cellCol = Math.floor(cellIndex / 5);

    for (let row = 0; row < penta.rows; row++) {
        for (let col = 0; col < penta.cols; col++) {
            const index = col * penta.rows + row;
            setBoard(board, cellCol + col, cellRow + row, 0);
        }
    }
}

function printBoard(state) {
    const { cells, columns } = state;

    let output = '';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < columns; col++) {
            const index = ROWS * col + row;
            output += `${cells[index]}`

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

    return { penta, rows, cols, id: pentaNumber };
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

    return { penta: penta90, cols: cols90, rows: rows90, id: penta.id };
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
function mirrorPenta(penta) {
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

    return { penta: pentaM, rows, cols, id: penta.id }
}

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

function pentaToString(penta) {
    let strRows = [];

    for (let row = 0; row < penta.rows; row++) {
        let strRow = '';
        for (let col = 0; col < penta.cols; col++) {
            const index = col * penta.rows + row;
            const value = penta.penta[index];
            const cellStr = value === 0 ? '#' : value.toString(16);
            strRow += cellStr;
        }
        strRows.push(strRow);
    }

    const pentaStr = strRows.join('\n');
    return pentaStr;
}

function solve(allPentas, pentasIndecies) {
    const board = createBoard(3);
    const pentas = allPentas.filter((penta, index) => pentasIndecies.indexOf(index) !== -1);
    const solution = innerSolve(0, pentas, board);
    return solution;
}

function innerSolve(level, pentas, board) {
    printBoard(board);
    if (pentas.length === 0) {
        // success :)
        return copyBoard(board);
    }

    const emptyCellIndex = board.cells.indexOf(0);
    if (emptyCellIndex === -1) {
        console.log('no empty cells');
        return;
    }

    for (let pentaIndex = 0; pentaIndex < pentas.length; pentaIndex++) {
        const pentasWithReotation = pentas[pentaIndex];
        const allPentasButCurrent = pentas.concat();
        allPentasButCurrent.splice(pentaIndex, 1);

        for (penta of pentasWithReotation) {
            if (canFitOnBoard(board, penta, emptyCellIndex)) {
                addPentaToBoard(board, penta, emptyCellIndex);
                const solution = innerSolve(level++, allPentasButCurrent, board);
                if (solution) {
                    return solution;
                }
                removePentaFromBoard(board, penta, emptyCellIndex);
            }
        }
    }
}

function prepareAndSolve() {
    const pentasWithReotation = [];

    for (let pentaIndex = 1; pentaIndex < pentas.length; pentaIndex++) {
        let penta = pentas[pentaIndex];
        if (typeof penta.penta !== 'object') continue;

        const pentaWithRotation = [];
        const pentaStrings = [];

        let mirrorIndex = 0;
        do {
            let rotateIndex = 0;
            do {
                const pentaStr = pentaToString(penta);
                if (pentaStrings.indexOf(pentaStr) === -1) {
                    pentaStrings.push(pentaToString(penta));
                    pentaWithRotation.push(penta);    
                }
                penta = rotatePenta90(penta);    
                rotateIndex++;
            } while (rotateIndex < 4);

            penta = mirrorPenta(penta);
            mirrorIndex++;
        } while (mirrorIndex < 2)

        pentasWithReotation[pentaIndex] = pentaWithRotation;
    }

    const solution = solve(pentasWithReotation, [2, 3, 10]);
    console.log(solution);
}

prepareAndSolve();
