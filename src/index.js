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
  //每个地鼠洞
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick()}
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
      squares: Array(9).fill(null),
      textForGameStartBtn: 'Game Start',
      score: 0,
      countDown: 10,
      isStarted: false
    };
  }

  //随机选择一个地鼠洞，并钻出地鼠
  moleAppear() {
    const randomNum = Math.floor(Math.random() * this.state.squares.length);
    const holes = Array(9).fill(null);
    if (this.state.isStarted) holes[randomNum] = '鼠';
    this.setState({
      squares: holes
    });
  }

  //处理点击开始按钮
  handleStartGameBtnClick() {
    if (!this.state.isStarted) {
      this.prepareNewGame();
    }
    this.startNewGame();
  }

  //每次开始游戏前准备工作
  prepareNewGame() {
    this.setState({
      isStarted: true,
      score: 0,
      countDown: 10,
      textForGameStartBtn: 'Try Again'
    });
  }

  //开始新游戏
  startNewGame() {
    clearInterval(this.interval);
    this.startCountDown();
  }

  //开始倒计时
  startCountDown() {
    this.setState({
      squares: Array(9).fill(null),
      countDown: 10
    });
    this.interval = setInterval(() => {
      this.countTime();
      this.moleAppear();
    }, 1000);
  }

  countTime() {
    if (!this.state.countDown) {
      this.gameOver();
      return false;
    }
    this.setState({
      countDown: this.state.countDown - 1
    });
  }

  gameOver() {
    clearInterval(this.interval);
    this.setState({
      isStarted: false,
      textForGameStartBtn: 'Game Start'
    });
  }

  //鼠标点击处理：判断是否打中=>计算得分
  handleClick(i) {
    if (this.state.squares[i] === '鼠')
      this.setState({
        score: this.state.score + 1
      });
  }

  render() {
    const intro = 'Whac-A-Mole';

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{intro}</div>
          <div>Score: {this.state.score}</div>
          <div>
            CountDown：
            {this.state.countDown} s
          </div>
          <div>
            <button
              className="start-game-btn"
              onClick={() => this.handleStartGameBtnClick()}
            >
              {this.state.textForGameStartBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

// WEBPACK FOOTER //
// src/index.js
