import {createContext} from 'react';

// const SocketContext = createContext<undefined | SocketIOClient.Socket>(undefined);
const SocketContext = createContext<{socketContext: SocketContextType, setSocketContext: UpdateSocketContextType}>({
  socketContext: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSocketContext: () => {},
});

export default SocketContext;
