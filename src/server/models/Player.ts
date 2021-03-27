import { Room } from './Room';
import _ from 'lodash';

export const players: Player[] = [];

export class Player {
  id: string;
  username: string;
  room: string;
  isLeader: boolean;
  gameover: boolean;
  score?: number;
  tilesStack: string[]; // array of future tetriminos
  spectrum: Matrix;
  // blockedRows: number;
  
  constructor({ id, username }: {id: string, username: string }) {
    this.id = id;
    this.username = username;
    this.room = '';
    this.isLeader = false;
    this.gameover = false;
    this.tilesStack = [];
    this.spectrum = _.map(Array(20), () => _.fill(Array(10), 0));
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

  addRoomInfo(roomName: string): Player {
    this.room = roomName;
    const room = Room.getByName(roomName);
    if (room)
      this.isLeader = room.getPlayers().length > 0 ? false : true;
    return this;
  }

  deletePlayer(playerId: string): boolean {
    const index = players.findIndex(player => player.id === playerId);

    if (index !== -1) {
      players.splice(index, 1)[0];
      return true;
    }
    return false;
  }

  // Computed property - no need to recompute room leader for the moment
  // get isLeader(): boolean {
  //   const room = Room.getByName(this.room); // we already create room and add player to it by this time so it's always false
  //   console.log(room);
  //   if (!room) return true;
  //   return room.players.length === 0 ? true : false;
  // }
}
