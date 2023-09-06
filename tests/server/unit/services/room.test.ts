import { Socket } from "socket.io";
import { RoomService } from '../../../../src/server/services/room'

jest.mock('socket.io');

describe("RoomService", () => {
  let roomService: RoomService;
  let socket: Socket;

  beforeEach(() => {
    roomService = RoomService.getInstance();
    // Create a new mock instance of Socket for each test
    socket = new (require('socket.io').Socket)();
  });

  afterEach(() => {
    // Reset the singleton instance after each test
    (RoomService as any).instance = null;
  });

  it("should create a new room when no available rooms exist", () => {
    const roomId = roomService.findAvailableRoom();
    const room = roomService.getRoomByRoomId(roomId);

    expect(roomId).toMatch(/^room-\d+$/);
    expect(room.players).toHaveLength(0);
  });

  it("should return an existing room when an available room exists", () => {
    const roomId1 = roomService.findAvailableRoom();
    const room1 = roomService.getRoomByRoomId(roomId1);

    roomService.addPlayerToRoom(roomId1, socket);

    const roomId2 = roomService.findAvailableRoom();
    const room2 = roomService.getRoomByRoomId(roomId2);

    expect(roomId2).toBe(roomId1);
    expect(room2).toBe(room1);
    expect(room2.players).toHaveLength(1);
    expect(room2.players).toContain(socket);
  });

  it("should add a player to a room", () => {
    const roomId = roomService.findAvailableRoom();
    const room = roomService.getRoomByRoomId(roomId);

    roomService.addPlayerToRoom(roomId, socket);

    expect(room.players).toHaveLength(1);
    expect(room.players).toContain(socket);
  });

  it("should empty a room", () => {
    const roomId = roomService.findAvailableRoom();
    const room = roomService.getRoomByRoomId(roomId);

    roomService.addPlayerToRoom(roomId, socket);
    roomService.emptyRoom(roomId);

    expect(room.players).toHaveLength(0);
  });

  it("should return the room ID for a given socket", () => {
    const roomId = roomService.findAvailableRoom();
    roomService.addPlayerToRoom(roomId, socket);

    const foundRoomId = roomService.getRoomIdBySocket(socket);

    expect(foundRoomId).toBe(roomId);
  });

  it("should return undefined if the socket is not found in any room", () => {
    const foundRoomId = roomService.getRoomIdBySocket(socket);

    expect(foundRoomId).toBeUndefined();
  });
});