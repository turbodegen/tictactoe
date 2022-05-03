import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
      return (
        <button 
            className="square" 
            onClick={props.onSquareClicked}
        >
          {props.value}
        </button>
      );
  }
  
  class Board extends React.Component {
      renderSquare(i) {
      return (
      <Square 
        value={this.props.squares[i]}
        onSquareClicked={() => {this.props.onBoardClick(i)}}
        />
      );
    }
  
    render() { 
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null),
            col: 0,
            row: 0
          }
        ],
        buttonClicked: 0,
        XisNext: true,
        stepNumber: 0,
      };      
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber +1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if(calculateWinner(squares) || squares[i]){
        return;
      }

      squares[i] = this.state.XisNext ? 'X' : 'O';

      const col = (i % 3) + 1;
      const row =  Math.floor((i / 3) + 1);

      this.setState({
        history: history.concat([{
          squares: squares,
          col: col,
          row: row
        }]),
        XisNext: !this.state.XisNext,
        stepNumber: history.length
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        XisNext: (step % 2) == 0,
        buttonClicked: step        
      })
    }

    handleReset() {
      this.setState(
        {
          history: [
            {
              squares: Array(9).fill(null),
              col: 0,
              row: 0
            }
          ],
          XisNext: true,
          stepNumber: 0,
          buttonClicked: 0,
        })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];

      const winner = calculateWinner(current.squares);
      
      const moves = history.map((step, move) => {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
             <MoveHistory 
              move={move}
              col={step.col}
              row={step.row}
              id={this.state.buttonClicked}
            /></button>
          </li>
        )
      })

      let status;
      if(winner){
        status = `Winner: ${winner}`
      } else {
        status = `Next player: ${this.state.XisNext ? 'X': 'O'}`;
      }

      return (
        <div>
          <div className="game-board">
            <Board
              squares={current.squares}
              onBoardClick={(i) => {this.handleClick(i)}}
             />
          </div>
          <br />
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
          <br />
          <button 
            className="submit" 
            onClick={() =>this.handleReset()}
          >
            Reset
          </button>
        </div>
      );
    }
  }

  function MoveHistory(props) {
    const desc = props.move ?
    `Go to move# ${props.move}. Location:(${props.col},${props.row})`:
    'Go to game start';
    if(props.move == props.id){
      return <div><b>{desc}</b></div>;
    }
    else {
      return <div>{desc}</div>;
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  