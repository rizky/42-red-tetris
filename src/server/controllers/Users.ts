const users: User[] = [];

// Join user to chat
export const userJoin = ({
  id, username, room
}: {
  id: string, username: string, room: string }
): User => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

// Get current user
export const getCurrentUser = (id: string): Maybe<User> => {
  return users.find(user => user.id === id);
};

// User leaves chat
export const userLeave = (id: string): Maybe<User> => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// Get room users
export const getRoomUsers = (room: string): User[] => {
  return users.filter(user => user.room === room);
};
