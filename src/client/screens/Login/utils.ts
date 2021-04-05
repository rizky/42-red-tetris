import axios from 'axios';

export const isEmpty = (value?: string | null): boolean => value === undefined || value === null || value === '';

export const checkTextLength = (text?: string | null): boolean => {
  const maxLength = 15;
  if (isEmpty(text)) return false;
  if (text && text.length > maxLength) return false;
  return true;
};

export const checkSpecialChars = (text?: string | null): boolean => {
  const regexpr =  new RegExp('\\W'); // matches any non-word-character, to only allow [a-zA-Z0-9_]
  if (!text) return false;
  if (text.match(regexpr)) return false;
  return true;
};

export const checkUsername = async (username: string | null | undefined): Promise<boolean | undefined> => {
  if (!checkTextLength(username)) throw Error('Name must be 1-15 symbols');
  if (!checkSpecialChars(username)) throw Error('Use letters and numbers');
  try {
    const response = await axios.get(`${process.env.SERVER_URL}/player/${username}`);
    if (isEmpty(response.data.username)) return true;
    throw Error('Username already taken');
  } catch (error) {
    if (error.message === 'Username already taken')
      throw Error('Username already taken');
    console.log(error);
  }
};

export const checkRoomName = async (roomName: string | null | undefined): Promise<boolean | undefined> => {
  if (!checkTextLength(roomName)) throw Error('Name must be 1-15 symbols');
  if (!checkSpecialChars(roomName)) throw Error('Use letters and numbers');
  try {
    const response = await axios.get(`${process.env.SERVER_URL}/room/${roomName}`);
    if (isEmpty(response.data.name)) return true;
    throw Error('Room name already taken');
  } catch (error) {
    if (error.message === 'Room name already taken')
      throw Error('Room name already taken');
    console.log(error);
  }
};
