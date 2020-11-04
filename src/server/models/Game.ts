import { Room, rooms } from './Room';

export class Game {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  get rooms(): Maybe<Room[]> {
    return rooms;
  }

  // remove room when leader leaves and push others out of room

  static getWaitingRooms(): Maybe<Room[]> {
    return rooms.filter((room) => room.gameStarted === false);
  }

  static getWaitingRoomNames(): Maybe<string[]> {
    const roomObjects = rooms.filter((room) => room.gameStarted === false);
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
