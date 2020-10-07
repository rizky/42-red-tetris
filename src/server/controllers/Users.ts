// import { users } from 'src/server/models/User';
// import { users } from '/server/models/User';
import { users } from '../models/User';

// const users: UserType[] = [];

// // TODO: finish moving User to model
// export class User {
//   id: string;
//   username: string;
//   room: string;
//   isLeader: boolean;
  
//   constructor(user: UserType) {
//     const { id, username, room } = user;
//     this.id = id;
//     this.username = username;
//     this.room = room;
//     // if room exists ( === already has leader) - false
//     // if room doesn't exist - true
//     this.isLeader = false; // TODO: apply logic
//     users.push(this);
//   }

// }

// Get current user
export const getCurrentUserBySocketId = (id: string): Maybe<UserType> => {
  return users.find(user => user.id === id);
};

// User leaves chat
export const userLeave = (id: string): Maybe<UserType> => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// Get room users
export const getRoomUsers = (room: string): UserType[] => {
  return users.filter(user => user.room === room);
};
