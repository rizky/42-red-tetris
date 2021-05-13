import _ from 'lodash';
import { Player, players } from './Player';
import { Piece } from './Piece';
import { blankMatrix } from '../../config/constants';

export const rooms: Room[] = [];

export class Room {
  name: string;
  players: Player[];
  gameStarted: boolean; // Room is closed when game has started, default false
  gameover: boolean; // room is gameover when all the players are gameover (except winner)
  
  constructor(name: string) {
    this.players = [];
    this.name = name;
    this.gameStarted = false;
    this.gameover = false;
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
    const index = this.players.findIndex(player => player.id === playerId); // player's index in room.players[]
    const index2 = players.findIndex(player => player.id === playerId); // player's index in const players[]

    if (index !== -1 && index2 !== -1) {
      this.players.splice(index, 1)[0];
      players.splice(index2, 1)[0];
      return true;
    }
    return false;
  }

  assignAnotherLeader(leftPlayerId: string): Player | undefined {
    if (!this.players[0].isLeader && this.players[0].id !== leftPlayerId) {
      // Update isLeader for room.players[0]
      this.players[0].isLeader = true;
    
      // Update isLeader for const players[room.players[0]]
      const newLeaderIndex = players.findIndex(player => player.id === this.players[0].id);
      players[newLeaderIndex].isLeader = true;

      const newLeader = this.players[0];
      return newLeader;
    }
    return undefined;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  startGame(): TetriminosType[] {
    this.gameStarted = true;
    const tileStack = [new Piece().type, new Piece().type, new Piece().type, new Piece().type, new Piece().type];

    return tileStack;
  }

  uploadMoreTetrisTiles(): TetriminosType[] {
    return [new Piece().type, new Piece().type, new Piece().type, new Piece().type, new Piece().type];
  }

  // When player gameover he should not be deleted from the room but just unassigned from leader possition and player.gameover = true
  playerGameover(playerGameover: Player): boolean {
    const index = this.players.findIndex(player => player.id === playerGameover.id); // player's index in room.players[]
    const index2 = players.findIndex(player => player.id === playerGameover.id); // player's index in const players[]

    if (playerGameover.isLeader) {
      this.players[index].isLeader = false;
      players[index2].isLeader = false;
    }

    this.players[index].gameover = true;
    players[index2].gameover = true;

    return true;
  }

  updatePlayerSpectrum(playerId: string, spectrum: Matrix): Player[] {
    const index = this.players.findIndex(player => player.id === playerId); // player's index in room.players[]
    const index2 = players.findIndex(player => player.id === playerId); // player's index in const players[]

    this.players[index].spectrum = spectrum;
    players[index2].spectrum = spectrum;

    return this.players;
  }

  assignWinner(): Player | undefined {
    const playersLeft = this.players.filter((player) => !player.gameover);

    if (playersLeft.length === 1) {
      const index = this.players.findIndex(player => player.id === playersLeft[0].id); // player's index in room.players[]
      const index2 = players.findIndex(player => player.id === playersLeft[0].id); // player's index in const players[]

      this.players[index].isWinner = true;
      players[index2].isWinner = true;
      return this.players[index];
    }
    return;
  }

  isRoomGameover(): boolean {
    const endGame = this.players.filter((player) => !player.gameover).length > 1 ? false : true;
    if (endGame) this.gameover = true;

    return endGame;
  }

  updatePlayerScore(playerId: string, score: number): void {
    const index = this.players.findIndex(player => player.id === playerId); // player's index in room.players[]
    const index2 = players.findIndex(player => player.id === playerId); // player's index in const players[]

    this.players[index].score = score;
    players[index2].score = score;
  }

  restartGame(): void {
    const rankedPlayers = _.reverse(_.sortBy(this.players, (player) => player.score));
    const winner = rankedPlayers[0];

    const restartPlayer = (player: Player) => {
      player.isWinner = false;
      player.gameover = false;
      player.spectrum = blankMatrix;
      if (player.username === winner.username) player.isLeader = true;
    };

    // room.players[]
    this.players.map((player) => restartPlayer(player));

    // const players[]
    const thisRoomPlayers = _.filter(players, (player) => player.room === this.name);
    thisRoomPlayers.map((player) => restartPlayer(player));
  }
}
