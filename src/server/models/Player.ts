import { Room } from './Room';

export const players: Player[] = [];

export class Player {
  id: string;
  username: string;
  room: string;
  isLeader: boolean;
  score?: number;
  // blockedRows: number;
  
  constructor({ id, username, roomName }: {id: string, username: string, roomName: string }) {
    this.id = id;
    this.username = username;
    this.room = roomName;
    this.isLeader = Room.getByName(roomName) ? false : true;
    players.push(this);
  }

  // Get player by id
  static getById(playerId: string): Player | undefined {
    return players.find(player => player.id === playerId);
  }

  // Get player by username
  static getByUsername(username: string): Player | undefined {
    return players.find(player => player.username === username);
  }

  // Computed property - no need to recompute room leader for the moment
  // get isLeader(): boolean {
  //   const room = Room.getByName(this.room); // we already create room and add player to it by this time so it's always false
  //   console.log(room);
  //   if (!room) return true;
  //   return room.players.length === 0 ? true : false;
  // }
}
