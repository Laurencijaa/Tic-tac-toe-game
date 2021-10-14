import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  //Function component - only contain render method and do not have state
  //What should happen on click and what should be shown comes from parent component - Board
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  //Receive squares and onClick props from the Game component.
  //Passing also location of the square to onClick.
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
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
  //Setting up initial state
  //stepNumber state reflects the move displayed to the user now
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    //If we go back in time and then make a new move from that point
    // we throw away all the future history that would now become incorrect
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    //Create copy of array to avoid data mutation
    const squares = current.squares.slice();
    //If someone won the game or square is filled, stop
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
     //Defining logic if xIsNext is true that X, otherwise O
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      //concat method does not mutate original array. push() does
      history: history.concat([
        {
          squares: squares
        }
      ]),
      //After we made a new move, we need to update stepNumber
      //This ensures that we do not end up showing same number
      stepNumber: history.length,
      ////flipping state - if now is X, then it should be not X
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    //Always render currently selected move
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    //Maping history of moves to React elements representing buttons on the screen.
    //And display a list of buttons to "jump" to past moves
    //Step variables refers to current history element value
    //Move refers to the current history element index
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      //For each move we create list item with button
      //It’s strongly recommended that you assign proper keys whenever you build dynamic lists.
      //If you don’t have an appropriate key,
      //you may want to consider restructuring your data so that you do.
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    //use most recent history entry to determine and display game status
    //Game component is rendering game status and therefore Board component can skip doing this
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));


/* Possible additional improvements: 
Display the location for each move in the format (col, row) in the move history list.
Bold the currently selected item in the move list.
Rewrite Board to use two loops to make the squares instead of hardcoding them.
Add a toggle button that lets you sort the moves in either ascending or descending order.
When someone wins, highlight the three squares that caused the win.
When no one wins, display a message about the result being a draw.
*/