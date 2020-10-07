export const games: GameType[] = [];

export class Game {
  room: string;
  users: UserType[];
  
  constructor(game: GameType) {
    const { room, users } = game;
    this.users = users;
    this.room = room;
    games.push(this);
  }

  getUsers(): UserType[] {
    return this.users;
  }

  // If game exists then room name is taken and user can only join the game
  // Should it be not a method of this class?
  getGameByRoomName(room: string): Maybe<GameType> {
    const game = games.filter(game => game.room === room);
    if (game.length > 1) throw 'same room name used more than once!';
    return game[0];
  }

  // getUserByUsername(username: string): Maybe<UserType> {

  // }

}
