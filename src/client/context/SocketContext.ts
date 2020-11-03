import {createContext} from 'react';

const SocketContext = createContext<undefined | SocketIOClient.Socket>(undefined);

export default SocketContext;
