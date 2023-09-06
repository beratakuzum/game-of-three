import { getUserInput } from '../utils/input';
import { Socket } from 'socket.io-client';
import {GameService} from "../services/game";


module.exports = (socket: Socket, gameService: GameService) => {
  const gameStartHandler = () => {
    getUserInput('Please enter a whole number: ', (number) => {
      setTimeout(() => {
        socket.emit('initialMove', number);
      }, 1000);
    });
  }
  const gameWaitHandler = () => {
    console.log('Waiting for the other player to make a move...');
  }
  const gameNextHandler = (number: number) => {
    console.log(`Received number: ${number}`);
    gameService.play(number);
  }
  const gameOverHandler = (message: string) => {
    console.log(`Game over! ${message}`);
    socket.disconnect();
  }
  const opponentDisconnectedHandler = (message: string) => {
    console.log(`Opponent disconnected! ${message}`);
  }
  socket.on('start', gameStartHandler);
  socket.on('wait', gameWaitHandler);
  socket.on('next', gameNextHandler);
  socket.on('gameover', gameOverHandler);
  socket.on('opponentDisconnected', opponentDisconnectedHandler);
}
