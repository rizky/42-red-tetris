import moment from 'moment';
import _ from 'lodash';

import { SOCKETS } from '../../config/constants';
import { Player, players } from '../models/Player';
import { Room } from '../models/Room';
import { Game } from '../models/Game';
import { app } from '../App';

const formatMessage = (username: string, text: string): Message => {
  return {
    username,
    text,
    time: moment().format('h:mm a'),
  };
};

const botName = 'Red Tetris';

const connectSocketIO = (): void => {
  // const io = app.settings.io;
  const io = app.get('io');

  io.on('connection', (socket: SocketIO.Socket) => {
    socket.on(SOCKETS.CREATE_USER, (username: string) => {
      new Player({ id: socket.id, username });
    });

    socket.on(SOCKETS.CHOOSE_ROOM, ({ username, roomName }: { username: string, roomName: string }) => {
      // Fetch room if it exists or create if it doesn't exist
      let room = Room.getByName(roomName);
      if (!room) {
        room = new Room(roomName);
        const roomNames = Game.getWaitingRoomNames();
        socket.broadcast.emit(SOCKETS.UPDATE_WAITING_ROOMS, roomNames);
      }

      // Add player to current room
      const player = Player.getByUsername(username);
      if (player) {
        room.addPlayer(player);
        console.log('On join room: ', players);
      }
    });

    // TODO: separate CHOOSE_ROOM and ENTER_ROOM to different `socket.on` events
    // On front move socket that creates room from Playground component to ChooseRoom component (on Play button click)
    // Before, when we created room on Playground load, we created empty room when in solo mode: [ Room { players: [], name: undefined, gameStarted: false } ]
    // Now it's fixed. Delete comment if clear @rizky


    /*
    ** TODO: tmp SOCKETS.ENTER_ROOM by url params, del after debugging
    */
    socket.on(SOCKETS.ENTER_ROOM, ({ username, roomName }: { username: string, roomName: string }) => {
      // Fetch room if it exists or create if it doesn't exist
      let room = Room.getByName(roomName);
      if (!room) {
        room = new Room(roomName);
        const roomNames = Game.getWaitingRoomNames();
        socket.broadcast.emit(SOCKETS.UPDATE_WAITING_ROOMS, roomNames);
      }

      // Fetch or create player and add player to current room
      let player = Player.getByUsername(username);
      if (!player) {
        player = new Player({ id: socket.id, username });
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
    ** TODO: uncomment when tmp SOCKETS.ENTER_ROOM by url params is deleted
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

    socket.on(SOCKETS.START_GAME, ({ username, roomName }: { username: string, roomName: string }) => {
      const player = Player.getByUsername(username);
      const room = Room.getByName(roomName);

      if (!player || !room) return;
      if (player.isLeader) {
        const startTile = room.startGame();
        const roomNames = Game.getWaitingRoomNames();
        socket.broadcast.emit(SOCKETS.UPDATE_WAITING_ROOMS, roomNames);
        io.to(room.name).emit(SOCKETS.START_GAME, { tilesStack: player.tilesStack, startTile });
      }
    });

    socket.on(SOCKETS.PAUSE_GAME, ({ username, roomName }: { username: string, roomName: string }) => {
      const player = Player.getByUsername(username);
      const room = Room.getByName(roomName);

      if (room && player) {
        io.to(room.name).emit(SOCKETS.PAUSE_GAME);
      }
    });

    // Listen to chat message and send it to the room
    socket.on(SOCKETS.CHAT_MESSAGE, ({ username, message, roomName }: { username: string, message: string, roomName: string }) => {
      // Send to everyone in the room except sender
      socket.broadcast.to(roomName).emit(SOCKETS.CHAT_MESSAGE, formatMessage(username, message));
    });

    // Fetch all waiting rooms to Login screen
    socket.on(SOCKETS.FETCH_WAITING_ROOMS, () => {
      const roomNames = Game.getWaitingRoomNames();
      socket.emit(SOCKETS.FETCH_WAITING_ROOMS, roomNames);
    });

    // Add penalty rows to opponents
    socket.on(SOCKETS.PENALTY_ROWS, ({ roomName, rowsNumber }: { roomName: string, rowsNumber: number }) => {
      // Send to everyone in the room except sender
      socket.broadcast.to(roomName).emit(SOCKETS.PENALTY_ROWS, rowsNumber);
    });

    const playerLeft = (player?: Player) => {
      if (!player) return;
      const room = Room.getByName(player.room);
      if (!room) { // if player left before room was created (from ChooseRoom screen)
        player.deletePlayer(player.id);
      } else { // if player left after room was created (from Playground screen)
        socket.leave(room.name); // TODO: maybe uncomment
        room.removePlayer(player.id);
        console.log('On leave room: ', players, room.players);
    
        if (room.players.length === 0) {
          const gameStarted = room.gameStarted;
          Game.removeRoom(room.name);
          // We only need it if game has not been started and room was deleted.
          // If started game was finished we don't care about waiting rooms -
          // room with started game was deleted from waiting rooms on START_GAME
          if (!gameStarted) {
            const roomNames = Game.getWaitingRoomNames();
            socket.broadcast.emit(SOCKETS.UPDATE_WAITING_ROOMS, roomNames);
          }
        }

        // If there is only one active player left in the room - endGame and assign him as winner
        const endGame = room.isRoomGameover();
        if (endGame) {
          room.assignWinner();
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

    socket.on(SOCKETS.PLAYER_LEFT, (username: string) => {
      const player = Player.getByUsername(username);
      playerLeft(player);
    });

    socket.on(SOCKETS.GAMEOVER, ({ username, roomName }: { username: string, roomName: string }) => {
      const room = Room.getByName(roomName);
      const player = Player.getByUsername(username);

      if (room && player) {
        room.playerGameover(player);
        const endGame = room.isRoomGameover();
        if (endGame) room.assignWinner();
        // send to everyone in the room
        io.to(roomName).emit(SOCKETS.GAMEOVER, { players: room.players, endGame });
      }
    });

    socket.on(SOCKETS.UPDATE_SPECTRUM, ({ username, roomName, spectrum }: { username: string, roomName: string, spectrum: Matrix }) => {
      const room = Room.getByName(roomName);
      const player = Player.getByUsername(username);

      if (room && player) {
        const roomPlayers = room.updatePlayerSpectrum(player.id, spectrum);
        // Send to everyone in the room except sender
        socket.broadcast.to(roomName).emit(SOCKETS.UPDATE_SPECTRUM, roomPlayers);
      }
    });

    socket.on(SOCKETS.UPDATE_SCORE, ({ username, roomName, score }: { username: string, roomName: string, score: number }) => {
      const room = Room.getByName(roomName);
      const player = Player.getByUsername(username);

      if (room && player) {
        room.updatePlayerScore(player.id, score);
        if (player.isWinner)
          io.to(roomName).emit(SOCKETS.REDIRECT_TO_RANKING); // Redirect all players to ranking page after player.isWinner score was updated
      }
    });

    socket.on(SOCKETS.FETCH_ROOM_RANKING, ({ username, roomName, gameMode }: { username: string, roomName: string, gameMode: string }) => {
      const room = Room.getByName(roomName);
      const player = Player.getByUsername(username);

      if (room && player) {
        const rankedPlayers = _.reverse(_.sortBy(room.players, (player) => player.score));
        // send to this user only
        socket.emit(SOCKETS.FETCH_ROOM_RANKING, rankedPlayers);
      }

      // TODO: Here I tested how I can forbid access to pages that I entered fom URL but sis not create. Uncomment it at the end of development
      // if (gameMode !== 'solo' && !(room || player)) {
      //   console.log('why? ', room, player);
      //   return (socket.emit(SOCKETS.FORBIDDEN));
      // }
    });

    // Runs when socket disconnects
    socket.on('disconnect', () => {
      const player = Player.getById(socket.id);
      playerLeft(player);
    });
  });
};

export default connectSocketIO;
