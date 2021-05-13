import { Room } from './Room';
import { blankMatrix } from '../../config/constants';

export const players: Player[] = [];

export class Player {
  id: string;
  username: string;
  room: string;
  isLeader: boolean;
  gameover: boolean;
  score: number;
  spectrum: Matrix;
  isWinner: boolean;
  
  constructor({ id, username }: {id: string, username: string }) {
    this.id = id;
    this.username = username;
    this.room = '';
    this.isLeader = false;
    this.gameover = false;
    this.score = 0;
    this.spectrum = blankMatrix;
    this.isWinner = false;
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
}
