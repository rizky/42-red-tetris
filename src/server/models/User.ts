import { Room } from './Game';

export const users: User[] = [];
// {"user_id": User}

export class User {
  id: string;
  username: string;
  room: string;
  // isLeader: boolean;
  score?: number;
  
  constructor(user: UserType) {
    const { id, username, room } = user;
    this.id = id;
    this.username = username;
    this.room = room;
    // this.isLeader = this.getRoomUsers(room).length === 0 ? true : false;
    users.push(this);
  }

  // Computed property
  get isLeader(): boolean {
    const room = Room.getByName(this.room);
    if (!room) return true;
    return room.users.length === 0 ? true : false;
  }

  // Get room users
  getRoomUsers(room: string): UserType[] {
    return users.filter(user => user.room === room);
  }

  // User leaves game playground
  leave() {
    const index = users.findIndex(user => user.id === this.id);

    if (index !== -1) {
       users.splice(index, 1)[0];
    }
  }

}
