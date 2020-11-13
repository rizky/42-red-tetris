type UserContextType = {username: undefined | string, room: undefined | string};
type UpdateUserContextType =  (() => void) | (({username: string, room: string}) => void);