import { Component, computed, render, signal } from 'no-react';

type Player = 'X' | 'O';
type Board = (Player | null)[];

const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

const winnerOf = (board: Board) => {
  const line = lines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
  return line ? {player: board[line[0]]!, line} : null;
};

class Game extends Component {
  history = signal<Board[]>([Array(9).fill(null)]);
  step = signal(0);

  board = computed(() => this.history()[this.step()]);
  next = computed<Player>(() => this.step() % 2 === 0 ? 'X' : 'O');
  winner = computed(() => winnerOf(this.board()));
  draw = computed(() => !this.winner() && this.board().every(Boolean));

  play(square: number) {
    if (this.board()[square] || this.winner()) {
      return;
    }

    const board = [...this.board()];
    board[square] = this.next();

    // Playing after going back in time drops the moves that came after.
    this.history.update(history => [...history.slice(0, this.step() + 1), board]);
    this.step.update(n => n + 1);
  }

  status = () => {
    const winner = this.winner();

    if (winner) return `${winner.player} wins!`;
    if (this.draw()) return 'A draw.';
    return `Next: ${this.next()}`;
  };

  render() {
    // The nine squares are created once; each binds to its own cell of the current board.
    const squares = Array.from({length: 9}, (_, square) => (
      <button
        className={() => `square ${this.winner()?.line.includes(square) ? 'win' : ''}`}
        disabled={() => !!this.board()[square] || !!this.winner()}
        onClick={() => this.play(square)}
        aria-label={`Square ${square + 1}`}
      >
        {() => this.board()[square]}
      </button>
    ));

    return (
      <div className="game">
        <div>
          <p className="status">{this.status}</p>
          <div className="board">{squares}</div>
        </div>
        <div>
          <h2>Moves</h2>
          {/* Re-rendered whenever a move is made; moves are few, so a plain map is enough. */}
          <ol className="moves">
            {() => this.history().map((_, move) => (
              <li>
                <button aria-pressed={() => this.step() === move} onClick={() => this.step.set(move)}>
                  {move ? `Go to move #${move}` : 'Go to game start'}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }
}

render(<Game />, document.getElementById('app')!);
