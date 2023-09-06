import { GameService } from '../../../../src/client/services/game'
import { Socket } from 'socket.io-client';

jest.mock('socket.io-client');

describe('GameService', () => {
  let mockSocket: Socket;
  let gameService: GameService;

  beforeEach(() => {
    // Create a new mock instance of Socket for each test
    mockSocket = new (require('socket.io-client').Socket)();

    // Initialize the GameService with the mockSocket
    gameService = new GameService(mockSocket);
  });

  it('should determine the move correctly', () => {
    expect(gameService['determineMove'](3)).toBe(3);
    expect(gameService['determineMove'](4)).toBe(3);
    expect(gameService['determineMove'](5)).toBe(6);
  });

  it('should play the move and emit it to the socket', (done) => {
    // Mock the socket.emit method
    const emitSpy = jest.spyOn(mockSocket, 'emit');

    // Call the play method
    gameService.play(4);

    // Wait for the setTimeout to execute
    setTimeout(() => {
      // Check if the socket.emit method was called with the correct arguments
      expect(emitSpy).toHaveBeenCalledWith('move', 3);
      done();
    }, 1000);
  });
});
