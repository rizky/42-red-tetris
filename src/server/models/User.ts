import { Game } from './Game';

export const users: UserType[] = [];

export class User {
  id: string;
  username: string;
  room: string;
  isLeader: boolean;
  score?: number;
  
  constructor(user: UserType) {
    const { id, username, room } = user;
    this.id = id;
    this.username = username;
    this.room = room;
    this.isLeader = this.getRoomUsers(room).length === 0 ? true : false;
    users.push(this);
  }

  // Get room users
  getRoomUsers(room: string): UserType[] {
    return users.filter(user => user.room === room);
  }

  // User leaves game playground
  userLeave(id: string): Maybe<UserType> {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  }

}
