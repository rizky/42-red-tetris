import _ from 'lodash';

import { Player } from '/server/models/Player';

describe('Player class', () => {
  const newPlayer = new Player({id: '123', username: 'test'});

  it('should return new Player', () => {
    expect(newPlayer).toEqual({
      id: '123',
      username: 'test',
      room: '',
      isLeader: false,
      gameover: false,
      score: 0,
      spectrum: _.map(Array(20), () => _.fill(Array(10), 0)),
      isWinner: false,
    });
  });

  it('should return undefined for getById', () => {
    expect(Player.getById('no-such-id')).toEqual(undefined);
  });

  it('should return valid player for getById', () => {
    expect(Player.getById('123')).toEqual(newPlayer);
  });

  it('should return undefined for getByUsername', () => {
    expect(Player.getByUsername('no-such-username')).toEqual(undefined);
  });

  it('should return valid player for getByUsername', () => {
    expect(Player.getByUsername('test')).toEqual(newPlayer);
  });

  it('should add roomName to player', () => {
    expect(newPlayer.addRoomInfo('room-name')).toEqual({ ...newPlayer, room: 'room-name' });
  });

  it('should return true for deletePlayer', () => {
    expect(newPlayer.deletePlayer('123')).toEqual(true);
  });

  it('should return false for deletePlayer', () => {
    expect(newPlayer.deletePlayer('no-such-id')).toEqual(false);
  });
});
