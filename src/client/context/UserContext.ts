import {createContext} from 'react';

const userContext = {username: undefined, room: undefined};

const UserContext = createContext<{userContext: UserContextType, setUserContext: UpdateUserContextType}>({
  userContext,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUserContext: () => {},
});

export default UserContext;
