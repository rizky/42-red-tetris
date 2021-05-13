import moment from 'moment';
import _ from 'lodash';

import { SOCKETS } from '../../config/constants';
import { Player, players } from '../models/Player';
import { Room } from '../models/Room';
import { Game } from '../models/Game';

const formatMessage = (username: string, text: string): Message => {
  return {
    username,
    text,
    time: moment().format('h:mm a'),
  };
};

const botName = 'Red Tetris';

/*
** Helper functions updateWaitingRooms, playerLeft:
*/

const updateWaitingRooms = (socket: SocketIO.Socket) => {
  const roomNames = Game.getWaitingRoomNames();
  socket.broadcast.emit(SOCKETS.UPDATE_WAITING_ROOMS, roomNames);
};

const playerLeft = ({ player, socket, io }: { player?: Player, socket: SocketIO.Socket, io: SocketIO.Server }) => {
  if (!player) return;
  const room = Room.getByName(player.room);
  if (!room) { // if player left before room was created (from ChooseRoom screen)
    player.deletePlayer(player.id);
  } else { // if player left after room was created (from Playground screen)
    socket.leave(room.name); // TODO: maybe uncomment
    room.removePlayer(player.id);
    console.log('On leave room: ', room.players);

    if (room.players.length === 0) {
      const gameStarted = room.gameStarted;
      Game.removeRoom(room.name);
      // We only need it if game has not been started and room was deleted.
      // If started game was finished we don't care about waiting rooms -
      // room with started game was deleted from waiting rooms on START_GAME
      if (!gameStarted) {
        updateWaitingRooms(socket);
      }
    }

    // If there is only one active player left in the room - endGame and assign him as winner
    const endGame = room.isRoomGameover();
    if (endGame) {
      room.assignWinner();
      updateWaitingRooms(socket);
      // send to everyone in the room
      return io.to(room.name).emit(SOCKETS.GAMEOVER, { players: room.players, endGame });
    }

    // If current player was room leader - assign another player as leader
    if (player.isLeader) {
      room.assignAnotherLeader(player.id);
    }

    io.to(room.name).emit(
      SOCKETS.CHAT_MESSAGE,
      formatMessage(botName, `${player.username} has left the game`),
    );
    // Send players and room info when player leaves
    io.to(room.name).emit(SOCKETS.UPDATE_ROOM_PLAYERS, {
      room: room.name,
      players: room.players,
    });
  }
};


const connectSocketIO = (io: SocketIO.Server): void => {
  io.on('connection', (socket: SocketIO.Socket) => {
    /*
    ** SOCKETS.CREATE_USER
    ** On Login screen ChooseUsername player created new Player with username
    */
    socket.on(SOCKETS.CREATE_USER, (username: string) => {
      new Player({ id: socket.id, username });
    });

    /*
    ** SOCKETS.CHOOSE_ROOM
    ** On Login screen ChooseRoom player created or joined the room
    */
    socket.on(SOCKETS.CHOOSE_ROOM, ({ username, roomName }: { username: string, roomName: string }) => {
      // Fetch room if it exists or create if it doesn't exist
      let room = Room.getByName(roomName);
      if (!room) {
        room = new Room(roomName);
        updateWaitingRooms(socket);
      }

      // Add player to current room
      const player = Player.getByUsername(username);
      if (player) {
        room.addPlayer(player);
        console.log('On join room: ', players);
      }
    });

    /*
    ** SOCKETS.ENTER_ROOM
    ** Player entered Playground screen
    */
    socket.on(SOCKETS.ENTER_ROOM, ({ username, roomName }: { username: string, roomName: string }) => {
      // Fetch room if it exists or create if it doesn't exist
      let room = Room.getByName(roomName);
      if (!room) {
        room = new Room(roomName); // TODO: this is to create room by URL
        updateWaitingRooms(socket);
      }

      // Fetch or create player and add player to current room
      let player = Player.getByUsername(username);
      if (!player) {
        player = new Player({ id: socket.id, username }); // TODO: this is to create room by URL
        room.addPlayer(player);
        console.log('On join room: ', players);
      }

      // ENTER_ROOM
      socket.join(room.name);
      console.log(`Socket ${socket.id} joined ${room.name}`);

      // Welcome current player in chat
      socket.emit(SOCKETS.CHAT_MESSAGE, formatMessage(botName, `Hi ${player.username}! Welcome to Room ${room.name}!`));

      // Send current player info to Playground
      socket.emit(SOCKETS.FETCH_CURRENT_PLAYER, player);

      // Broadcast chat message when a player connects
      socket.broadcast
        .to(room.name)
        .emit(
          SOCKETS.CHAT_MESSAGE,
          formatMessage(botName, `${player.username} has joined the chat`),
        );

      // Send players and room info when new player joins
      io.to(room.name).emit(SOCKETS.UPDATE_ROOM_PLAYERS, {
        room: room.name,
        players: room.players,
      });
    });

    /*
    ** SOCKETS.ENTER_ROOM 2
    */
    /*
    ** TODO: uncomment when tmp SOCKETS.ENTER_ROOM by url params is deleted (and probably debug)
    ** Now not necessary cause now I redirect from any screen to home screen if there is no socket
    ** and socket is created when entering home screen (Login CreateUsername)
    */
    // socket.on(SOCKETS.ENTER_ROOM, ({ username, roomName }: { username: string, roomName: string }) => {
    //   const player = Player.getByUsername(username);
    //   const room = Room.getByName(roomName);

    //   if (player && room) {
    //     socket.join(room.name);
    //     console.log(`Socket ${socket.id} joined ${room.name}`);

    //     // Welcome current player in chat
    //     socket.emit(SOCKETS.CHAT_MESSAGE, formatMessage(botName, `Hi ${player.username}! Welcome to Room ${room.name}!`));

    //     // Send current player info to Playground
    //     socket.emit(SOCKETS.FETCH_CURRENT_PLAYER, player);

    //     // Broadcast chat message when a player connects
    //     socket.broadcast
    //       .to(room.name)
    //       .emit(
    //         SOCKETS.CHAT_MESSAGE,
    //         formatMessage(botName, `${player.username} has joined the chat`),
    //       );

    //     // Send players and room info when new player joins
    //     io.to(room.name).emit(SOCKETS.UPDATE_ROOM_PLAYERS, {
    //       room: room.name,
    //       players: room.players,
    //     });
    //   }
    // });

    /*
    ** SOCKETS.START_GAME
    ** Leader asked to start the game
    */
    socket.on(SOCKETS.START_GAME, ({ username, roomName }: { username: string, roomName: string }) => {
      const player = Player.getByUsername(username);
      const room = Room.getByName(roomName);

      if (!player || !room) return;
      if (player.isLeader) {
        const tileStack = room.startGame();
        updateWaitingRooms(socket);
        io.to(room.name).emit(SOCKETS.START_GAME, tileStack);
      }
    });
    
    /*
    ** SOCKETS.PAUSE_GAME
    ** Leader asked to pause the game
    */
    socket.on(SOCKETS.PAUSE_GAME, ({ username, roomName }: { username: string, roomName: string }) => {
      const player = Player.getByUsername(username);
      const room = Room.getByName(roomName);

      if (room && player) {
        io.to(room.name).emit(SOCKETS.PAUSE_GAME);
      }
    });

    /*
    ** SOCKETS.MORE_TETRIS_TILES
    ** Clent asked to send more tetris tiles to the Playground room
    */
    socket.on(SOCKETS.MORE_TETRIS_TILES, ({ username, roomName }: { username: string, roomName: string }) => {
      const player = Player.getByUsername(username);
      const room = Room.getByName(roomName);

      if (room && player) {
        const tileStack = room.uploadMoreTetrisTiles();
        // sens to everyone in the room
        io.to(room.name).emit(SOCKETS.MORE_TETRIS_TILES, tileStack);
      }
    });

    /*
    ** SOCKETS.CHAT_MESSAGE
    ** Listen to chat message and send it to the room
    */
    socket.on(SOCKETS.CHAT_MESSAGE, ({ username, message, roomName }: { username: string, message: string, roomName: string }) => {
      // Send to everyone in the room except sender
      socket.broadcast.to(roomName).emit(SOCKETS.CHAT_MESSAGE, formatMessage(username, message));
    });

    /*
    ** SOCKETS.FETCH_WAITING_ROOMS
    ** Fetch all waiting rooms to Login screen
    */
    socket.on(SOCKETS.FETCH_WAITING_ROOMS, () => {
      const roomNames = Game.getWaitingRoomNames();
      socket.emit(SOCKETS.FETCH_WAITING_ROOMS, roomNames);
    });

    /*
    ** SOCKETS.PENALTY_ROWS
    ** Add penalty rows to opponents
    */
    socket.on(SOCKETS.PENALTY_ROWS, ({ roomName, rowsNumber }: { roomName: string, rowsNumber: number }) => {
      // Send to everyone in the room except sender
      socket.broadcast.to(roomName).emit(SOCKETS.PENALTY_ROWS, rowsNumber);
    });

    /*
    ** SOCKETS.PLAYER_LEFT
    ** Player clicked exit button on Keypad
    */
    socket.on(SOCKETS.PLAYER_LEFT, (username: string) => {
      const player = Player.getByUsername(username);
      playerLeft({ player, socket, io });
    });
    
    /*
    ** SOCKETS.UPDATE_SPECTRUM
    ** On Playground screen player places tetrimino piece on the Matrix bottom and mini map Spectrums of opponents need to be updated
    */
    socket.on(SOCKETS.UPDATE_SPECTRUM, ({ username, roomName, spectrum }: { username: string, roomName: string, spectrum: Matrix }) => {
      const room = Room.getByName(roomName);
      const player = Player.getByUsername(username);
 
      if (room && player) {
        const roomPlayers = room.updatePlayerSpectrum(player.id, spectrum);
        // Send to everyone in the room except sender
        socket.broadcast.to(roomName).emit(SOCKETS.UPDATE_SPECTRUM, roomPlayers);
      }
    });
  
    /*
    ** SOCKETS.GAMEOVER
    ** Player lost the game
    */
    socket.on(SOCKETS.GAMEOVER, ({ username, roomName }: { username: string, roomName: string }) => {
      const room = Room.getByName(roomName);
      const player = Player.getByUsername(username);

      if (room && player) {
        room.playerGameover(player);
        const endGame = room.isRoomGameover();
        if (endGame) {
          room.assignWinner();
          updateWaitingRooms(socket);
        }
        // TODO: assign another player as leader!!!!
        // send to everyone in the room
        io.to(roomName).emit(SOCKETS.GAMEOVER, { players: room.players, endGame });
      }
    });

    /*
    ** SOCKETS.UPDATE_SCORE
    ** When Player is gameover, he emits update score socket event, backend receives score.
    ** If he is the last player on the Playground, we can redirect all players to the Ranking screen
    */
    socket.on(SOCKETS.UPDATE_SCORE, ({ username, roomName, score, isSoloMode }: { username: string, roomName: string, score: number, isSoloMode: boolean | undefined }) => {
      const room = Room.getByName(roomName);
      const player = Player.getByUsername(username);

      if (room && player) {
        room.updatePlayerScore(player.id, score);
        if (player.isWinner || isSoloMode)
          io.to(roomName).emit(SOCKETS.REDIRECT_TO_RANKING); // Redirect all players to ranking page after player.isWinner score was updated
      }
    });

    /*
    ** SOCKETS.FETCH_ROOM_RANKING
    ** When on ranking screen, send sorted ranked players of this room
    */
    socket.on(SOCKETS.FETCH_ROOM_RANKING, ({ username, roomName }: { username: string, roomName: string }) => {
      const room = Room.getByName(roomName);
      const player = Player.getByUsername(username);

      if (room && player) {
        const rankedPlayers = _.reverse(_.sortBy(room.players, (player) => player.score));
        // send to this user only
        socket.emit(SOCKETS.FETCH_ROOM_RANKING, rankedPlayers);
      }
    });

    /*
    ** SOCKETS.SPEED_MODE
    ** Change speed mode of falling tetriminos to superspeed for all room players
    */
    socket.on(SOCKETS.SPEED_MODE, ({ username, roomName }: { username: string, roomName: string }) => {
      const room = Room.getByName(roomName);
      const player = Player.getByUsername(username);

      if (room && player) {
        // send to everyone in the room
        io.to(roomName).emit(SOCKETS.SPEED_MODE);
      }
    });

    /*
    ** SOCKETS.RESTART_GAME
    ** Room winner can restart the game on Ranking screen
    */
    socket.on(SOCKETS.RESTART_GAME, ({ username, roomName }: { username: string, roomName: string }) => {
      const room = Room.getByName(roomName);
      const player = Player.getByUsername(username);

      if (room && player) {
        room.restartGame();
        // send to everyone in the room
        io.to(roomName).emit(SOCKETS.RESTART_GAME);
      }
    });

    /*
    ** 'disconnect'
    ** Runs when socket disconnects (when window is closed)
    */
    socket.on('disconnect', () => {
      const player = Player.getById(socket.id);
      playerLeft({ player, socket, io });
    });
  });
};

export default connectSocketIO;
