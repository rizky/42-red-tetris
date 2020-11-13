import {createContext} from 'react';

const userContext = {username: undefined, room: undefined};

const UserContext = createContext<{userContext: UserContextType, updateUserContext: UpdateUserContextType}>({
  userContext,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateUserContext: () => {},
});

export default UserContext;
