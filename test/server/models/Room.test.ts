import _ from 'lodash';

import { Player } from '/server/models/Player';
import { Room } from '/server/models/Room';

describe('Room class', () => {
  const newRoom = new Room('room-1');
  const newPlayer = new Player({ id: '123', username: 'test' });

  it('should return new Room', () => {
    expect(newRoom).toEqual({
      name: 'room-1',
      players: [],
      gameStarted: false, 
      gameover: false,
    });
  });

  it('should return undefined for getByName', () => {
    expect(Room.getByName('no-such-room')).toEqual(undefined);
  });

  it('should return valid room for getByName', () => {
    expect(Room.getByName('room-1')).toEqual(newRoom);
  });

  it('should return true for addPlayer', () => {
    expect(newRoom.addPlayer(newPlayer)).toEqual(true);
  });

  it('should return true for removePlayer', () => {
    expect(newRoom.removePlayer('123')).toEqual(true);
  });

  it('should return false for removePlayer', () => {
    expect(newRoom.removePlayer('no-such-id')).toEqual(false);
  });

  it('should return newLeader = secondPlayer for assignAnotherLeader', () => {
    const firstPlayer = new Player({id: '123', username: 'leader'});
    const secondPlayer = new Player({id: '321', username: 'not-leader'});

    newRoom.addPlayer(firstPlayer);
    newRoom.addPlayer(secondPlayer);
    newRoom.removePlayer('123');

    const newLeader = newRoom.assignAnotherLeader('123');
    expect(newLeader).toEqual(secondPlayer);
  });

  it('should return undefined for assignAnotherLeader because leader was not removed from the room', () => {
    const newRoom2 = new Room('room-2');
    const firstPlayer = new Player({id: '123', username: 'leader'});
    const secondPlayer = new Player({id: '321', username: 'not-leader'});

    newRoom2.addPlayer(firstPlayer);
    newRoom2.addPlayer(secondPlayer);
    // newRoom2.removePlayer('123');

    const newLeader = newRoom2.assignAnotherLeader('123');
    expect(newLeader).toEqual(undefined);
  });

  it('should return room players', () => {
    const newRoom2 = new Room('room-2');
    const firstPlayer = new Player({id: '123', username: 'leader'});
    const secondPlayer = new Player({id: '321', username: 'not-leader'});

    newRoom2.addPlayer(firstPlayer);
    newRoom2.addPlayer(secondPlayer);

    expect(newRoom2.getPlayers()).toEqual([firstPlayer, secondPlayer]);
  });

  it('should set gameStarted and return room tile stack for startGame', () => {
    const newRoom2 = new Room('room-2');
    const firstPlayer = new Player({id: '123', username: 'leader'});
    const secondPlayer = new Player({id: '321', username: 'not-leader'});

    newRoom2.addPlayer(firstPlayer);
    newRoom2.addPlayer(secondPlayer);

    const result = newRoom2.startGame();

    expect(result).toEqual(expect.arrayContaining([]));
    expect(result).toHaveLength(5);
  });

  it('should return tile stack for uploadMoreTetrisTiles', () => {
    const result = newRoom.uploadMoreTetrisTiles();

    expect(result).toEqual(expect.arrayContaining([]));
    expect(result).toHaveLength(5);
  });

  it('should set room player to gameover for playerGameover', () => {
    const newRoom3 = new Room('room-3');
    const firstPlayer = new Player({id: '123', username: 'leader'});
    const secondPlayer = new Player({id: '321', username: 'not-leader'});

    firstPlayer.addRoomInfo(newRoom3.name);
    newRoom3.addPlayer(firstPlayer);
    newRoom3.addPlayer(secondPlayer);

    expect(newRoom3.playerGameover(firstPlayer)).toEqual(true);
  });

  it('should return players[] after updatePlayerSpectrum', () => {
    const newSpectrum = _.map(Array(20), () => _.fill(Array(10), 0));
    const newRoom3 = new Room('room-3');
    const firstPlayer = new Player({id: '123', username: 'leader'});
    const secondPlayer = new Player({id: '321', username: 'not-leader'});

    firstPlayer.addRoomInfo(newRoom3.name);
    newRoom3.addPlayer(firstPlayer);
    newRoom3.addPlayer(secondPlayer);

    expect(newRoom3.updatePlayerSpectrum('123', newSpectrum)).toEqual([firstPlayer, secondPlayer]);
  });

  it('should assignWinner and return Player', () => {
    const newRoom3 = new Room('room-3');
    const firstPlayer = new Player({id: '123', username: 'leader'});
    const secondPlayer = new Player({id: '321', username: 'not-leader'});

    firstPlayer.addRoomInfo(newRoom3.name);
    newRoom3.addPlayer(firstPlayer);
    newRoom3.addPlayer(secondPlayer);
    newRoom3.playerGameover(firstPlayer);

    expect(newRoom3.assignWinner()).toEqual(secondPlayer);
  });

  it('should assignWinner and return undefined', () => {
    const newRoom3 = new Room('room-3');
    const firstPlayer = new Player({id: '123', username: 'leader'});
    const secondPlayer = new Player({id: '321', username: 'not-leader'});

    firstPlayer.addRoomInfo(newRoom3.name);
    newRoom3.addPlayer(firstPlayer);
    newRoom3.addPlayer(secondPlayer);
    // newRoom3.playerGameover(firstPlayer);

    expect(newRoom3.assignWinner()).toEqual(undefined);
  });

  it('should return true of false for isRoomGameover', () => {
    const newRoom3 = new Room('room-3');
    const firstPlayer = new Player({id: '123', username: 'leader'});
    const secondPlayer = new Player({id: '321', username: 'not-leader'});

    firstPlayer.addRoomInfo(newRoom3.name);
    newRoom3.addPlayer(firstPlayer);
    newRoom3.addPlayer(secondPlayer);
    
    expect(newRoom3.isRoomGameover()).toEqual(false);

    newRoom3.playerGameover(firstPlayer);
    expect(newRoom3.isRoomGameover()).toEqual(true);

  });

  it('should updatePlayerScore and return nothing', () => {
    const newRoom3 = new Room('room-3');
    const firstPlayer = new Player({id: '123', username: 'leader'});
    const secondPlayer = new Player({id: '321', username: 'not-leader'});

    firstPlayer.addRoomInfo(newRoom3.name);
    newRoom3.addPlayer(firstPlayer);
    newRoom3.addPlayer(secondPlayer);
    newRoom3.updatePlayerScore('123', 300);

    expect(firstPlayer.score).toEqual(300);
  });
});
