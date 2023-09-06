import { io, Socket } from 'socket.io-client';
import { GameService } from "./services/game";

const gameHandlers = require("./event_handlers/game");


class SocketManager {
  private gameService: GameService;
  private socket: Socket;
  private serverUrl: string;

  constructor() {
    this.initializeConfig();
    this.serverUrl = `${process.env.SOCKET_HOST}:${process.env.SOCKET_PORT}`;
    console.log("Connecting to the server: ", this.serverUrl);
    this.socket = io(this.serverUrl);
    this.gameService = new GameService(this.socket);
    this.setupSocketEvents();
  }
  private setupSocketEvents() {
    this.socket.on('connect', () => {
      console.log('Connected to the server');
    });
    gameHandlers(this.socket, this.gameService);
    this.socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
  }
  private initializeConfig() {
    if(process.env.NODE_ENV === "test") {
      require('dotenv').config({ path: './././test.env' });
    } else {
      require('dotenv').config({ path: './././.env' });
    }
  }
}

// Start the client
new SocketManager();
