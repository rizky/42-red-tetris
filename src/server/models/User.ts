import { Room } from './Room';

export const users: User[] = [];

export class User {
  id: string;
  username: string;
  room: string;
  // isLeader: boolean; - computed property, see below
  score?: number;
  
  constructor(user: UserType) {
    const { id, username, room } = user;
    this.id = id;
    this.username = username;
    this.room = room;
    users.push(this);
  }

  // Get user by id
  static getById(userId: string): User | undefined {
    return users.find(user => user.id === userId);
  }

  // Get user by username
  static getByUsername(username: string): User | undefined {
    return users.find(user => user.id === username);
  }

  // Computed property
  get isLeader(): boolean {
    const room = Room.getByName(this.room);
    if (!room) return true;
    return room.users.length === 0 ? true : false;
  }

  // User leaves game playground
  leave(): boolean {
    const index = users.findIndex(user => user.id === this.id);

    if (index !== -1) {
      users.splice(index, 1)[0];
      return true;
    }
    return false;
  }

}
