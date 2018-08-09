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
      record: [{ second: 0 }],   //用于记录历史计时
      stepNumber: 0,
      nextNum: 1,
      isStarted: false,
      textForGameStartBtn: 'Game Start',
      second: 0,
    };
  }

  //每次点击格子后进行两个操作：1.填格子 2.判断胜负
  handleClick(i) {
    this.renderBox(i);
    this.ifWin();
  }

  renderBox(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
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

  ifWin() {
    let win = true;
    win = calculateFifteen(this.state.history[this.state.stepNumber]);
    return win;
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      nextNum: step + 1,
    });
  }

  /*该按钮为“游戏开始”和“再来一次”按钮
    点击该按钮，将会显示新排行榜*/
  handleStartGameBtnClick() {
    if (!this.state.isStarted) {
      this.prepareNewGame();
    }
    this.startNewGame();
  }

  prepareNewGame() {
    this.setState({
      isStarted: true,
      textForGameStartBtn: 'Try Again',
    });
  }

  startNewGame() {
    //每次开始新游戏之前需停止计时，否则将会一直暗中计时
    clearInterval(this.interval);
    this.recordTime(this.state.second);
    rankTime(this.state.record);
    this.startTimer();
    this.jumpTo(0);
    //TODO this.askForUserName();
  }

  //开始计时
  startTimer() {
    this.setState({
      second: 0,
    });
    this.interval = setInterval(() => this.countTime(), 1000);
  }

  countTime() {
    this.setState({
      second: this.state.second + 1,
    });
  }

  //把当前计时记入计时数组
  recordTime(second) {
    this.setState({
      record: this.state.record.concat([{
        second: second,
      }]),
    });
  }

  render() {
    const intro =
      'You are given 1-9 9 numbers, please put them in the boxes to make them add up to 15 in a row or in a line.';
    const history = this.state.history;
    const current = history[this.state.stepNumber];

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
    if (this.ifWin()) {
      status = 'Congratulations!';
      clearInterval(this.interval);
    } else {
      if (this.state.nextNum < 10) {
        status = 'Next number: ' + this.state.nextNum;
      } else {
        status = 'Game Over';
        clearInterval(this.interval);
      }
    }

    const record = this.state.record;
    const rank = record.map((recond) => {
      const ranking = recond.second + 's'
      return (
        <li key={recond}>{ranking}</li>
      );
    });

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
        <div>
          <li>排行榜</li>
          <ol>{rank}</ol>
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
  let isWin = true;  //因为胜利条件比较苛刻，默认状态为胜利
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares.squares[a] && squares.squares[b] && squares.squares[c]) {
      if (squares.squares[a] + squares.squares[b] + squares.squares[c] !== 15) {
        isWin = false;
        break;
      }
    } else {
      isWin = false;
    }
  }
  return isWin;
}

//将历史计时进行排序的函数
function rankTime(record) {

}

/*
计时逻辑
  1、第一次点击，状态：false，行为：改状态为true，开始计时
  2、第二/n次点击（游戏没有结束），状态：true，行为：重新计时
  3、第二/n次点击（游戏已结束），状态：false，行为：改状态为true，开始计时
实际归类为2类
  1、游戏结束状态（false）点击：改状态为true，开始计时
  2、游戏进行状态（true）点击：重新计时
归纳为代码
  if (false) {
   改为true
  }    
  开始计时()
框架
  if (游戏结束状态) {
    准备游戏开始所要准备的一切(按钮文字啊，分数清零啊等等)
  }
  开始游戏(开始或者重新开始计时，输入玩家姓名等等)

  if (!this.state.isStarted) {
    this.prepareNewGame()
  }
  this.startNewGame()

可以用//TODO 记录暂时缺少的部分
*/

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
