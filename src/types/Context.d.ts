type UserContextType = {username?: string, room?: string};
type UpdateUserContextType =  (() => void) | (({username: string, room: string}) => void);

type SocketContextType = undefined | SocketIOClient.Socket;
type UpdateSocketContextType =  (() => void) | ((socket: SocketIOClient.Socket) => void);
