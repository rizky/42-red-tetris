import { Game } from '/server/models/Game';
import { Room } from '/server/models/Room';
import { Player } from '/server/models/Player';

describe('Game class', () => {
  const newGame = new Game('red-tetris');

  const room1 = new Room('room-1');
  const room2 = new Room('room-2');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const room3 = new Room('solo-room-3');
  const room4 = new Room('room-4');

  // Add players to room1 and set room to gameStarted
  const room1Player1 = new Player({id: '11', username: '11'});
  const room1Player2 = new Player({id: '12', username: '12'});

  room1.addPlayer(room1Player1);
  room1.addPlayer(room1Player2);
  room1.startGame();

  // Add players to room2 and set room to gameover by setting one of the players to gameover
  const room2Player1 = new Player({id: '21', username: '21'});
  const room2Player2 = new Player({id: '22', username: '22'});

  room2Player1.addRoomInfo(room2.name);
  room2.addPlayer(room2Player1);
  room2.addPlayer(room2Player2);
  room2.playerGameover(room2Player1);
  room2.isRoomGameover();


  it('should return new Game', () => {
    expect(newGame).toEqual({
      name: 'red-tetris',
    });
  });

  it('should return waiting rooms with !gameStarted && !gameover && !solo for getWaitingRooms', () => {
    expect(Game.getWaitingRooms()).toEqual([room4]);
  });

  it('should return waiting room names with !gameStarted && !gameover && !solo for getWaitingRoomNames', () => {
    expect(Game.getWaitingRoomNames()).toEqual(['room-4']);
  });

  it('should remove room and return true or false for removeRoom', () => {
    expect(Game.removeRoom('room-1')).toEqual(true);
    expect(Game.removeRoom('no-such-room')).toEqual(false);
  });
});
