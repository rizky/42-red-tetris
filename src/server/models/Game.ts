import { Room, rooms } from './Room';

export class Game {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  get rooms(): Maybe<Room[]> {
    return rooms;
  }

  // when leader leaves - assign another player as leader
  // when only 1 player left - he is a winner

  static getWaitingRooms(): Maybe<Room[]> {
    return rooms.filter((room) => !room.gameStarted && !room.gameover);
  }

  static getWaitingRoomNames(): Maybe<string[]> {
    const roomObjects = rooms.filter((room) => !room.gameStarted && !room.gameover);
    return roomObjects?.map((room) => room.name);
  }

  static removeRoom(roomName: string): boolean {
    const index = rooms.findIndex((room) => room.name === roomName);

    if (index !== -1) {
      rooms.splice(index, 1)[0];
      return true;
    }
    return false;
  }
}
