# 👾 Red-tetris - multiplayer online tetris

### Stack
#### Front
- React with hooks
- TypeScript
- React Native tags

#### Back
- Node.js + Express
- TypeScript

### The rest
- Client-server communication with Socket.io
- Tests with Jest
- Docker to build the app

### Rules

#### 🎮 Move around:
Arrow left, right - move tetris piece
Arrow down - move to the bottom faster
Space - drop the piece to the bottom

#### 👯 Multiplayer mode:
1. Create username and room name for player_1
2. Create player_2 with username, join an existing room
3. First player is the room leader, he can start the game
4. Move pieces to destroy rows in the bottom, like in usual tetris
5. When you destroy several rows, your opponent gets n-1 penalty rows in the bottom (play it to understand)
6. When pieces go to the top, game is over. Check your score on the Ranking screen!

#### 💃 Solo mode:
Just enjoy classic tetris on your own!

#### 🏆 Scoring:
- Each piece set gives 4 points
- Each row destroyed gives 10 points
- Last player is the winner - he gets 200 points

### Learnings of the project
**Client-server communication with Sockets.** When you create an action (like drop a tetrimino piece on the playground or send a chat message), you will `emit(SOCKET_NAME)` a socket. Backend will receive this socket and send this action to every one of your opponents. They will receive this info from the backend with `socket.on(SOCKET_NAME)` and will update the info on the screen (instantly receive a new message in chat, get penalty row).

Functional VS Object-oriented programming. The frontend of this app is done with functions and functional components thank to React hooks. Backend is using classes: Game, Room, Player, Piece. Because why not. No database is needed for this project.

### Launch the project
Click the link on the right, on this page

OR

Clone the repo and make sure you have Yarn installed. Go to the cloned repo, open 2 terminals, and from your command line run:

`yarn` and wait for it to finish
`yarn web` in the first terminal
`yarn api` in the second terminal

OR

Clone the repo and make sure you have Docker installed. Go to the pero and run:

`docker compose up`

Backend will run on http://localhost:3001/
Frontend will open Expo on http://localhost:19002/
After clicking "run in web" app will open on http://localhost:19006/
