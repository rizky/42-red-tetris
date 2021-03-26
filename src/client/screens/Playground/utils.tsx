const formatChatTitle = (leader: string): string => {
  return `Leader: ${leader}`;
};

const formatChatSubtitle = (players: string[]): string => {
  if (players.length === 0) return 'No players';
  return `Players: ${players.join(', ')}`;
};

const roomPlayersNames = (players?: PlayerType[]): string[] => {
  if (!players || players.length === 0) return [];
  const namesArray = players.map((player) => player.username);
  return namesArray;
};

export { formatChatSubtitle, formatChatTitle, roomPlayersNames };
