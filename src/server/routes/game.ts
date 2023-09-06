import { Server, Socket } from 'socket.io';
import { RoomService } from "../services/room";


module.exports = (io: Server, socket: Socket, roomService: RoomService) => {
  const initialMove = (number: number) => {
    console.log(`Received initial number: ${number}`);
    const roomId = roomService.getRoomIdBySocket(socket);
    if (!roomId) {
      return;
    }
    socket.broadcast.to(roomId).emit('next', number);
  }

  const move = (number: number) => {
    const roomId = roomService.getRoomIdBySocket(socket);
    if (!roomId) {
      return;
    }

    if (number / 3 === 1) {
      // The game is over; the current player wins
      socket.emit('gameover', 'You win!');
      socket.broadcast.to(roomId).emit('gameover', 'You lose!');
    } else if (Math.abs(number) === 1 || number % 3 !== 0 || number === 0) {
      socket.emit('gameover', 'Invalid move. You lose!');
      socket.broadcast.to(roomId).emit('gameover', 'You win!');
    } else {
      socket.broadcast.to(roomId).emit('next', number / 3);
    }
  }

  socket.on("initialMove", initialMove);
  socket.on("move", move);
}