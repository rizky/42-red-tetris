import { formatChatSubtitle, formatChatTitle, roomPlayersNames } from '/client/screens/Playground/utils';

describe('formatChatSubtitle', () => {
  const players = ['a', 'b', 'c'];

  it('should return chat subtitle with players names', () => {
    expect(formatChatSubtitle(players)).toEqual('Players: a, b, c');
  });
  it('should return chat subtitle No players', () => {
    expect(formatChatSubtitle([])).toEqual('No players');
  });
});

describe('formatChatTitle', () => {
  const leader = 'aaaa';
  it('should return chat title with leader', () => {
    expect(formatChatTitle(leader)).toEqual('Leader: aaaa');
  });
});

describe('roomPlayersNames', () => {
  const fakePlayers = [
    {
      id: 'wwf7DFQkHAHh2b7IAAAE',
      username: 'www', 
      room: '1',
      isLeader: false,
      gameover: false,
      score: 0,
      spectrum: [[]],
      isWinner: false,
    },
    {
      id: 'wwf7DFQkHAHh2b7IAAweweAE',
      username: 'qqq', 
      room: '1',
      isLeader: false,
      gameover: false,
      score: 0,
      spectrum: [[]],
      isWinner: false,
    },
  ];

  it('should return players names array', () => {
    expect(roomPlayersNames(fakePlayers)).toEqual(['www', 'qqq']);
  });
  it('should return empty array if players = []', () => {
    expect(roomPlayersNames([])).toEqual([]);
  });
  it('should return empty array if players = undefined', () => {
    expect(roomPlayersNames(undefined)).toEqual([]);
  });
});
