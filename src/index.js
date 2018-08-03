import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
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
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      nextNum: 1,
      isStarted: false,
      textForGameStartBtn: 'Game Start',
      second: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (!this.state.second && this.state.isStarted) {
      this.interval = setInterval(() => this.countTime(), 1000);
    }
    if (squares[i] || !this.state.isStarted) {
      return;
    }
    squares[i] = this.state.nextNum;
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      nextNum: this.state.nextNum + 1,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      nextNum: step + 1,
    });
  }

  handleStartGameBtnClick() {
    if (!this.state.isStarted) {
      this.setState({
        isStarted: true,
        textForGameStartBtn: 'Try Again',
      });
    } else {
      this.setState({
        second: 0,
      });
      clearInterval(this.interval);
      this.jumpTo(0);
    }
  }

  countTime() {
    this.setState({
      second: this.state.second + 1,
    });
  }

  render() {
    const intro =
      'You are given 1-9 9 numbers, please put them in the boxes to make them add up to 15 in a row or in a line.';
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const win = calculateFifteen(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (win) {
      status = 'Congratulations!';
    } else {
      if (this.state.nextNum < 10) {
        status = 'Next number: ' + this.state.nextNum;
      } else {
        status = 'Game Over'
      }
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
          <div>{intro}</div>
          <div>{status}</div>
          <div>Time: {this.state.second} s</div>
          <div>
            <button className="start-game-btn" onClick={() => this.handleStartGameBtnClick()}>{this.state.textForGameStartBtn}</button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateFifteen(squares) {
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
  let isWin = true;//default win
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[b] && squares[c]) {
      if (squares[a] + squares[b] + squares[c] !== 15) {
        isWin = false;
        break;
      }
    } else {
      isWin = false;
    }
  }
  return isWin;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
