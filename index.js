const chalk = require('chalk');

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
        columns: board.columns,
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

function canFitOnBoard(board, penta, cellCol, cellRow) {
    // const cellRow = cellIndex % 5;
    // const cellCol = Math.floor(cellIndex / 5);

    const maxRow = cellRow + penta.rows - 1;
    const maxCol = cellCol + penta.cols - 1;

    const isOutOfBoard = (maxRow >= 5 || maxCol >= board.columns || cellRow < 0 || maxCol < 0);
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

function addPentaToBoard(board, penta, cellCol, cellRow) {
    // const cellRow = cellIndex % 5;
    // const cellCol = Math.floor(cellIndex / 5);

    for (let row = 0; row < penta.rows; row++) {
        for (let col = 0; col < penta.cols; col++) {
            const index = col * penta.rows + row;
            const value = penta.penta[index];
            if (value != 0) {
                setBoard(board, cellCol + col, cellRow + row, value);
            }
        }
    }
}

function removePentaFromBoard(board, penta, cellCol, cellRow) {
    // const cellRow = cellIndex % 5;
    // const cellCol = Math.floor(cellIndex / 5);

    for (let row = 0; row < penta.rows; row++) {
        for (let col = 0; col < penta.cols; col++) {
            const index = col * penta.rows + row;
            const value = penta.penta[index];
            if (value != 0) {
                setBoard(board, cellCol + col, cellRow + row, 0);
            }
        }
    }
}

function printBoard(state) {
    const { cells, columns } = state;

    let output = '';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < columns; col++) {
            const index = ROWS * col + row;
            const pentaId = cells[index];
            output += chalk.keyword(pentas[pentaId].color).bold(`${pentaId.toString(16)}`)

            if (col < columns - 1) {
                output += ' ';
            }
        }
        output += '\n';
    }

    console.log(output);
}

function createPenta(pentaNumber, color, cols, str) {
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

    return { penta, rows, cols, id: pentaNumber, color };
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
    createPenta(1, 'blue',
        5,
        '*****'),
    createPenta(2, 'darkorange',
        2,
        '**' +
        '* ' +
        '* ' +
        '* '
    ),
    createPenta(3, 'sienna',
        4,
        ' *  ' +
        '****'
    ),
    createPenta(4, 'slateblue',
        4,
        '*** ' +
        '  **'),
    createPenta(5, 'skyblue',
        3,
        '***' +
        '  *' +
        '  *'),
    createPenta(6, 'hotpink',
        3,
        ' **' +
        '***'),
    createPenta(7, 'yellow',
        3,
        '***' +
        '* *'),
    createPenta(8, 'turquoise',
        3,
        '** ' +
        ' * ' +
        ' **'),
    createPenta(9, 'slategray',
        3,
        ' * ' +
        '** ' +
        ' **'),
    createPenta(10, 'green',
        3,
        '***' +
        ' * ' +
        ' * '
    ),
    createPenta(11, 'lime',
        3,
        '  *' +
        ' **' +
        '** '),
    createPenta(12, 'red',
        3,
        ' * ' +
        '***' +
        ' * ')
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
    const board = createBoard(pentasIndecies.length);
    const pentas = allPentas.filter((penta, index) => pentasIndecies.indexOf(index) !== -1);
    const solution = innerSolve(0, pentas, board);
    return solution;
}

function innerSolve(level, pentas, board) {
    // printBoard(board);
    if (pentas.length === 0) {
        // success :)
        return copyBoard(board);
    }

    const emptyCellIndex = board.cells.indexOf(0);
    if (emptyCellIndex === -1) {
        console.log('no empty cells');
        return;
    }

    const emptyCellRow = emptyCellIndex % 5;
    const emptyCellCol = Math.floor(emptyCellIndex / 5);

    for (let pentaIndex = 0; pentaIndex < pentas.length; pentaIndex++) {
        const pentasWithReotation = pentas[pentaIndex];
        const allPentasButCurrent = pentas.concat();
        allPentasButCurrent.splice(pentaIndex, 1);

        for (let penta of pentasWithReotation) {
            for (let offsetCol = 0; offsetCol < penta.cols; offsetCol++) {
                for (let offsetRow = 0; offsetRow < penta.rows; offsetRow++) {

                    const currCellCol = emptyCellCol - offsetCol;
                    const currCellRow = emptyCellRow - offsetRow;

                    if (canFitOnBoard(board, penta, currCellCol, currCellRow)) {
                        addPentaToBoard(board, penta, currCellCol, currCellRow);
                        const solution = innerSolve(level++, allPentasButCurrent, board);
                        if (solution) {
                            return solution;
                        }
                        removePentaFromBoard(board, penta, currCellCol, currCellRow);
                    }
        
                }
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

    const solution = solve(pentasWithReotation, [2, 5, 6, 8, 3, 11]);
    printBoard(solution);
}

prepareAndSolve();
