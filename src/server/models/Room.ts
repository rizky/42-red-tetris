import { Player, players } from './Player';
import { Piece } from './Piece';

export const rooms: Room[] = [];

export class Room {
  name: string;
  players: Player[];
  gameStarted: boolean; // Room is closed when game has started, default false
  // isValid: boolean; // Room is valid when there are 2 or more players. If number of players < 2 - game stops
  
  constructor(name: string) {
    this.players = [];
    this.name = name;
    this.gameStarted = false;
    rooms.push(this);
  }

  static getByName(name: string): Room | undefined {
    return rooms.find(room => room.name === name);
  }

  // Add new player after room is created
  addPlayer(player: Player): boolean {
    player.addRoomInfo(this.name);
    this.players.push(player);
    return true;
  }

  removePlayer(playerId: string): boolean {
    const index = this.players.findIndex(player => player.id === playerId); // remove from room.players[]
    const index2 = players.findIndex(player => player.id === playerId); // remove from const players[]

    if (index !== -1 && index2 !== -1) {
      this.players.splice(index, 1)[0];
      players.splice(index2, 1)[0];
      return true;
    }
    return false;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  startGame(): string {
    this.gameStarted = true;
    const startTile = new Piece().type;
    const tilesStack = [new Piece().type, new Piece().type, new Piece().type];
    players.map(player => player.tilesStack = tilesStack);
    this.players.map(player => player.tilesStack = tilesStack);
    return startTile;
  }
}
