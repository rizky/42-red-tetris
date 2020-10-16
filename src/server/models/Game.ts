// remove room when leader leaves
import { Room, rooms } from './Room';

export class Game {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  get rooms(): Maybe<Room[]> {
    return rooms;
  }

  static removeRoom(roomName: string): boolean {
    const index = rooms.findIndex(room => room.name === roomName);

    if (index !== -1) {
      rooms.splice(index, 1)[0];
      return true;
    }
    return false;
  }
}
