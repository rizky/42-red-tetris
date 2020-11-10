type UserContextType = {username: undefined | string, room: undefined | string};
type UpdateContextUserType =  (() => void) | (({username: string, room: string}) => void);