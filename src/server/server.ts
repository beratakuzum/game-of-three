import * as http from 'http';
import { Server, Socket } from 'socket.io';
import { GameService } from './services/game';
import { RoomService } from './services/room';


const gameRoutes = require("./routes/game");


// Create socket.io server and register routes
export class App {
  private server: http.Server = http.createServer();
  public io: Server = new Server(this.server);
  private gameService: GameService = new GameService();
  private roomService: RoomService = RoomService.getInstance();

  constructor() {
    this.initializeConfig()
    this.initializeRoutes();
  }
  public listen(port: string | undefined) {
    if (!port) {
      port = "3000";
    }
    this.server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
  private initializeRoutes() {
    this.io.on('connection', (socket: Socket) => {
      console.log("Connected socket: ", socket.id)
      this.gameService.startGame(socket);
      gameRoutes(this.io, socket, this.roomService);

      socket.on('disconnect', () => {
        // end game if a player disconnects
        this.gameService.endGame(socket);
      });
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