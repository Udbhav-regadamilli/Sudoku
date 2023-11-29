import { useState } from 'react';
import './App.css';


class Sudoku{

  /**
   * To intialize the 9x9 2D array grid with ' '.
   */
  constructor(){
      this.grid = Array.from({ length: 9 }, () => Array(9).fill(' '));
  }

  /**
   * To print the 2D array grid.
   */
  printSudoku(){
      console.log(" -----------------------------")
      for(let i=0; i<this.grid.length; i++){
          if(i !== 0 && i%3 === 0){
              console.log(" -----------------------------")
          }
          let string = ""
          for(let j=0; j<this.grid[i].length; j++){
              if(j%3 === 0){
                  string += "|"
              }
              string += " "+this.grid[i][j]+" "
          }
          console.log(string + "|")
      }
      console.log(" -----------------------------")
  }
  
  /**
   * This function checks if the given value exists in paticular row or not.
   * @param {Number} val The value which we want to check.
   * @param {Number} index In which row we want to check.
   * @returns true if the 'val' exists in the row 'index'.
   */
  rowCheck(val, index){
      return this.grid[index].includes(val)
  }

  /**
   * This function checks if the given value exists in paticular column or not.
   * @param {Number} val The value we need to check.
   * @param {Number} index In which column we need to check.
   * @returns true if the 'val' exists in the column 'index'.
   */
  colCheck(val, index){
      for(let i=0; i<9; i++){
          if(this.grid[i][index] === val){
              return true
          }
      }
      return false
  }

  /**
   * This method is used to check if the value exists in the sub grid of the 2D array or not.
   * @param {Number} val The value we need to check in the sub grid.
   * @param {Number} row The row index value to check sub grid array.
   * @param {Number} col The column index value to check the sub grid array.
   * @returns true, If the 'val' exists in the sub grid of the array.
   */
  subgrid(val, row, col){
      for(let i=Math.floor(row/3)*3; i<(Math.floor(row/3)*3)+3; i++){
          for(let j=Math.floor(col/3)*3; j<(Math.floor(col/3)*3)+3; j++){
              if(this.grid[i][j] === val){
                  return true
              }
          }
      }
      return false
  }
  
  /**
   * This method generates the sudoku.
   * @param {Number} dif To determine the difficult of the puzzle generator.
   */
  generateSudoku(dif){

      //The first row was filled with random unique values 1 to 9.
      let num = "123456789"
      for(let i=0; num.length > 0 && i < 9; i++){
          let index = Math.floor(Math.random() * num.length)
          let val = num.substring(index, index+1)
          this.grid[0][i] = val
          num = num.replace(val, '')
      }

      //First we solve the whole sudoku to ensure a possible solution exists.
      this.solver()

      //We remove the values from the possible solution such that it becomes a possible.
      this.removeValues(dif)
  }

  /**
   * This removes the values of the random row and col of the grid.
   * @param {Number} dif The dif value determines the difficultly of the puzzle.
   */
  removeValues(dif){
      for(let i=0; i<dif; i++){
          let row = Math.floor(Math.random() * 9)
          let col = Math.floor(Math.random() * 9)
          this.grid[row][col] = ' '
      }
  }

  /**
   * This method solves the puzzle grid by filling the possible values.
   * @returns true, if the puzzle grid is solvable.
   */
  solver(){
      for(let i=0; i<9; i++){
          for(let j=0; j<9; j++){

              //Need to replace the cell with value if the cell is empty.
              if(this.grid[i][j] === ' '){
                  for(let val=1; val<10; val++){

                      //Checks with every possible value.
                      if(!(this.rowCheck(val, i) || this.colCheck(val, j) || this.subgrid(val, i, j))){
                          this.grid[i][j] = val
                          if(this.solver()){
                              return true
                          }
                          this.grid[i][j] = ' '
                      }
                  }
                  return false
              }
          }
      }
      return true
  }
}

const sudokuObj = new Sudoku();
sudokuObj.generateSudoku(50);
const initale = getDeepCopy(sudokuObj.grid);
sudokuObj.solver();
const solution = getDeepCopy(sudokuObj.grid);

function getDeepCopy(arr){
  return JSON.parse(JSON.stringify(arr));
}

function App() {
  const [sudokuArr, setSudokuArr] = useState(initale);
  const [msg, setMsg] = useState('Hi');

  function onInputChange(e, row, col) {
    var val = parseInt(e.target.value) || ' ', grid = getDeepCopy(sudokuArr);
    if(val === ' ' || (val >= 1 && val <= 9)){
      grid[row][col] = val;
    }
    setSudokuArr(grid);
  }

  function CheckSudoku(){
    console.log(solution);
    console.log(sudokuArr);
    for (let i = 0; i < 9; i++) {
      for(let j=0; j < 9; j++){
        if(solution[i][j] !== sudokuArr[i][j]){
          setMsg(`Wrong answer.`);
          return null
        }
      }
    }
    setMsg(`Congratulations!, You have done it.`);
  }

  function SolveSudoku(){
    setSudokuArr(getDeepCopy(solution));
    setMsg('Done Successfully.');
  }

  function ResetSudoku(){
    setSudokuArr(getDeepCopy(initale));
    setMsg('');
  }

  return (
    <div className='App'>
      <div className='App-header'>
        <h3>Sudoku</h3>
        <table>
          <tbody>
            {
              [0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) => {
                return <tr key={rIndex} className={((row + 1)%3 === 0) ? 'bBorder' : ''}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
                    return <td key={rIndex + cIndex} className={((col + 1)%3 === 0) ? 'rBorder' : ''}>
                      <input onChange={(e) => onInputChange(e, row, col)} value={sudokuArr[row][col]} 
                      className='cellInput' 
                      disabled={sudokuArr[row][col] !== ' '}/>
                    </td>
                  })}
                </tr>
              })
            }
          </tbody>
        </table>
        <p>{msg}</p>
        <div className='buttonContainer'>
          <button className='checkButton' onClick={CheckSudoku}>Check</button>
          <button className='solveButton' onClick={SolveSudoku}>Solve</button>
          <button className='resetButton' onClick={ResetSudoku}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default App;
