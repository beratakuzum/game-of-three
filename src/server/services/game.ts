import { Socket } from 'socket.io';
import { RoomService } from './room';

export class GameService {
  public roomService: RoomService = RoomService.getInstance();

  constructor(){}
  public startGame(socket: Socket) {
    const roomId = this.roomService.findAvailableRoom();
    this.roomService.addPlayerToRoom(roomId, socket);

    if (this.roomService.getRoomByRoomId(roomId).players.length === 2) {
      console.log(`The room ${roomId} is full. Starting the game...`);
      // Randomly determine which player starts the game
      const startingPlayerIndex = Math.floor(Math.random() * 2);
      // Notify the starting player to begin
      this.roomService.getRoomByRoomId(roomId).players[startingPlayerIndex].emit('start');
      // Notify the other player to wait
      this.roomService.getRoomByRoomId(roomId).players[1 - startingPlayerIndex].emit('wait');
    }
  }

  public endGame(leavingSocket: Socket) {
    const roomId = this.roomService.getRoomIdBySocket(leavingSocket);
    if (!roomId) {
      return;
    }
    leavingSocket.leave(roomId);

    // disconnect other user in the room too
    const otherPlayer = this.roomService.getRoomByRoomId(roomId).players.filter(
      player => player.id !== leavingSocket.id
    )[0];
    if (otherPlayer) {
      otherPlayer.emit('opponentDisconnected', 'Your opponent has disconnected. You win!');
      otherPlayer.leave(roomId);
      otherPlayer.disconnect()
    }

    this.roomService.emptyRoom(roomId);
  }
}