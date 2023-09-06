// A singleton class that keeps rooms and handles room related operations
import {Socket} from "socket.io";

interface Room {
  players: Socket[];
}

export class RoomService {
  private static instance: RoomService;
  private rooms: { [key: string]: Room } = {};
  private constructor() { }

  // This implementation helps us to create a singleton class
  public static getInstance(): RoomService {
    if (!RoomService.instance) {
      RoomService.instance = new RoomService();
    }

    return RoomService.instance;
  }

  // Find an available room or create a new one
  public findAvailableRoom(): string {
    let roomId = '';
    for (const key of Object.keys(this.rooms)) {
      if (this.rooms[key].players.length < 2) {
        roomId = key;
        break;
      }
    }

    if (roomId === '') {
      roomId = `room-${Object.keys(this.rooms).length + 1}`;
      this.rooms[roomId] = { players: [] };
    }

    return roomId;
  }

  public addPlayerToRoom(roomId: string, socket: Socket): void {
    this.rooms[roomId].players.push(socket);
    socket.join(roomId);
  }

  public emptyRoom(roomId: string): void {
    this.rooms[roomId].players = [];
  }

  public getRoomByRoomId(roomId: string): Room {
    return this.rooms[roomId];
  }

  public getRoomIdBySocket(socket: Socket): string | undefined {
    for (const key of Object.keys(this.rooms)) {
      for (const player of this.rooms[key].players) {
        if (player.id === socket.id) {
          return key;
        }
      }
    }

    return ;
  }
}
