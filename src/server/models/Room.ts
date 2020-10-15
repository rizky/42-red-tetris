import { User, users } from './User';

export const rooms: Room[] = [];

export class Room {
  name: string;
  users: User[];
  // isClosed: boolean; // Room is closed when game has started, default false
  // isValid: boolean; // Room is valid when there are 2 or more players. If number of players < 2 - game stops
  
  constructor(name: string) {
    this.users = [];
    this.name = name;
    rooms.push(this);
  }

  static getByName(name: string): Room | undefined {
    return rooms.find(room => room.name === name);
  }

  // Add new user after room is created
  addUser(user: User): boolean {
    this.users.push(user);
    return true;
  }

  removeUser(userId: string): boolean {
    const index = this.users.findIndex(user => user.id === userId); // remove from room.users[]
    const index2 = users.findIndex(user => user.id === userId); // remove from const users[]

    if (index !== -1 && index2 !== -1) {
      this.users.splice(index, 1)[0];
      users.splice(index2, 1)[0];
      return true;
    }
    return false;
  }

  getUsers(): User[] {
    return this.users;
  }
}
