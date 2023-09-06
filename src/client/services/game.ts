import { Socket } from "socket.io-client";

export class GameService {
  private socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;
  }
  private determineMove(number: number): number {
    let move: number;
    if (number % 3 === 0) {
      move = number;
    }
    else if (number % 3 === 1) {
      move = number - 1;
    } else {
      move = number + 1;
    }
    return move;
  }

  public play(number: number): void {
    const move = this.determineMove(number);
    console.log(`Playing move: ${move}`);
    setTimeout(() => {
      this.socket.emit('move', move);
    }, 1000);
  }
}