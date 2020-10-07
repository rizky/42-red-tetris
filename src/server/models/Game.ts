import { User } from './User';

export const rooms: Room[] = [];

export class Room {
  name: string;
  users: User[];
  
  constructor(name: string) {
    const rooms_with_same_name = rooms.filter(room => room.name == name).length
    if (rooms_with_same_name > 0) throw 'same room name used more than once!';
    this.users = [];
    this.name = name;
    rooms.push(this);
  }

  static getByName(name: string) { 
    return rooms.find(room => room.name == name)
  }

  addUsers(...users: User[]) {
    this.users.push(...users);
  }

  removeUser(userID: string) {
    const index = this.users.findIndex(user => user.id === userID);

    if (index !== -1) {
       this.users.splice(index, 1)[0];
    }
  }

  // If game exists then room name is taken and user can only join the game
  // Should it be not a method of this class?
  // getGameByRoomName(room: string): Maybe<GameType> {
  //   const game = games.filter(game => game.room === room);
  //   if (game.length > 1) throw 'same room name used more than once!';
  //   return game[0];
  // }

  // getUserByUsername(username: string): Maybe<UserType> {

  // }

}
