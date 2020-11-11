import {createContext} from 'react';

const contextUser = {username: undefined, room: undefined};

const UserContext = createContext<{contextUser: UserContextType, updateContextUser: UpdateContextUserType}>({
  contextUser,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateContextUser: () => {},
});

export default UserContext;
