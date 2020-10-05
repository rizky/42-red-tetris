const formatChatSubtitle = (players: string[]): string => {
  if (players.length === 0) return 'No players';
  return `Players: ${players.join(', ')}`;
};

export default formatChatSubtitle;
