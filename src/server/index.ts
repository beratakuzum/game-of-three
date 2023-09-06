import {App} from "./server";

// Start the server
const app = new App();
app.listen(process.env.SOCKET_PORT);