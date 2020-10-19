import axios from 'axios';

const maxLength = 15;

export const isEmpty = (value?: string | null): boolean => value === undefined || value === null || value === '';

export const checkUsernameLength = (username?: string | null):boolean => {
  if (isEmpty(username)) return false;
  if (username && username.length > maxLength) return false;
  return true;
};

export const checkUsername = async (username: string | null | undefined): Promise<boolean | undefined> => {
  if (!checkUsernameLength(username)) {
    throw Error('Name must be 1-15 symbols');
  }
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
