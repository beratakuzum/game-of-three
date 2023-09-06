# Use an official Node.js runtime as the base image
FROM node:14

# Create and set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application source code to the container
COPY . .

# Expose the port on which your Socket.io server listens
EXPOSE 3000

# Start the Socket.io app when the container is run
CMD ["ts-node", "src/server/_server.ts"]
