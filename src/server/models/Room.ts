import { User } from './User';

export const rooms: Room[] = [];

export class Room {
  name: string;
  users: User[];
  
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
    const index = this.users.findIndex(user => user.id === userId);

    if (index !== -1) {
      this.users.splice(index, 1)[0];
      return true;
    }
    return false;
  }

  getUsers(): User[] {
    return this.users;
  }
}
