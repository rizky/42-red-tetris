import axios from 'axios';

import { isEmpty, checkTextLength, checkSpecialChars, checkUsername, checkRoomName, isRoomPlayersLimitAvailable, composeSoloRoomName } from '/client/screens/Login/utils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const fakePlayer = {
  id: 'wwf7DFQkHAHh2b7IAAAE',
  username: 'www', 
  room: '',
  isLeader: false,
  gameover: false,
};

const fakeRoom = {
  players: [{ id: 'rmgaGW_g5nPu70OGAAAL', username: 'qq', room: '1', isLeader: true, gameover: false }],
  name: '1',
  gameStarted: false,
};

describe('isEmpty', () => {
  const undefinedValue = undefined;
  const emptyStringValue = '';
  const nullValue = null;
  const notEmptyValue1 = 'not empty';

  it('should return true with undefined value', () => {
    expect(isEmpty(undefinedValue)).toEqual(true);
  });
  it('should return true with empty string value', () => {
    expect(isEmpty(emptyStringValue)).toEqual(true);
  });
  it('should return true with null value', () => {
    expect(isEmpty(nullValue)).toEqual(true);
  });
  it('should return false with not empty value', () => {
    expect(isEmpty(notEmptyValue1)).toEqual(false);
  });
});

describe('checkTextLength', () => {
  const falsyText = undefined;
  const tooShortText = '';
  const tooLongText = 'qwertyuiopasdfgh';
  const correctText = 'aaaaaaaa';

  it('should return false for falsyText', () => {
    expect(checkTextLength(falsyText)).toEqual(false);
  });
  it('should return false for tooShortText', () => {
    expect(checkTextLength(tooShortText)).toEqual(false);
  });
  it('should return false for tooLongText', () => {
    expect(checkTextLength(tooLongText)).toEqual(false);
  });
  it('should return true for correctText', () => {
    expect(checkTextLength(correctText)).toEqual(true);
  });
});

describe('checkSpecialChars', () => {
  const falsyText = undefined;
  const specialCharacter1 = '@';
  const specialCharacter2 = '/';
  const specialCharacterSpace = 'qwert yuIOP';
  const correctText2 = '_aaAA123';

  it('should return false for falsyText', () => {
    expect(checkSpecialChars(falsyText)).toEqual(false);
  });
  it('should return false for specialCharacter1', () => {
    expect(checkSpecialChars(specialCharacter1)).toEqual(false);
  });
  it('should return false for specialCharacter2', () => {
    expect(checkSpecialChars(specialCharacter2)).toEqual(false);
  });
  it('should return false for specialCharacterSpace', () => {
    expect(checkSpecialChars(specialCharacterSpace)).toEqual(false);
  });
  it('should return true for correctText2', () => {
    expect(checkSpecialChars(correctText2)).toEqual(true);
  });
});

describe('checkUsername', () => {
  it('should throw an error for undefinedValue', async () => {
    const undefinedValue = undefined;
    expect(checkUsername(undefinedValue)).rejects.toThrow('Name must be 1-15 symbols');
  });
  it('should throw an error for emptyStringValue', async () => {
    const emptyStringValue = '';
    expect(checkUsername(emptyStringValue)).rejects.toThrow('Name must be 1-15 symbols');
  });
  it('should throw an error for nullValue', async () => {
    const nullValue = null;
    expect(checkUsername(nullValue)).rejects.toThrow('Name must be 1-15 symbols');
  });
  it('should throw an error for specialCharacterUsername1', async () => {
    const specialCharacterUsername1 = 'n@pe';
    expect(checkUsername(specialCharacterUsername1)).rejects.toThrow('Use letters and numbers');
  });
  it('should throw an error for specialCharacterUsername2', async () => {
    const specialCharacterUsername2 = 'a b';
    expect(checkUsername(specialCharacterUsername2)).rejects.toThrow('Use letters and numbers');
  });
  it('should call checkUsername with fake axios and return taken username error', async () => {
    const existingUsername = 'ma_sha';
    const playerWithExistingUsername = { ...fakePlayer, username: existingUsername };
    mockedAxios.get.mockResolvedValue({ data: playerWithExistingUsername });
    expect(checkUsername(existingUsername)).rejects.toThrow(Error('Username already taken'));
  });
  it('should call checkUsername with fake axios and return true as the username is unique', async () => {
    const uniqueUsername = 'ma_sha';
    mockedAxios.get.mockResolvedValue({ data: '' }); // When username is not taken, response returns { data: "" }
    expect(checkUsername(uniqueUsername)).resolves.toBe(true);
  });
});

describe('checkRoomName', () => {
  it('should throw an error for undefinedValue', async () => {
    const undefinedValue = undefined;
    expect(checkRoomName(undefinedValue)).rejects.toThrow('Name must be 1-15 symbols');
  });
  it('should throw an error for emptyStringValue', async () => {
    const emptyStringValue = '';
    expect(checkRoomName(emptyStringValue)).rejects.toThrow('Name must be 1-15 symbols');
  });
  it('should throw an error for nullValue', async () => {
    const nullValue = null;
    expect(checkRoomName(nullValue)).rejects.toThrow('Name must be 1-15 symbols');
  });
  it('should throw an error for specialCharacterRoomName1', async () => {
    const specialCharacterRoomName1 = 'n@pe';
    expect(checkRoomName(specialCharacterRoomName1)).rejects.toThrow('Use letters and numbers');
  });
  it('should throw an error for specialCharacterRoomName2', async () => {
    const specialCharacterRoomName2 = 'a b';
    expect(checkRoomName(specialCharacterRoomName2)).rejects.toThrow('Use letters and numbers');
  });
  it('should call checkUsername with fake axios and return taken room name error', async () => {
    const existingRoomName = 'ro_om';
    const roomWithExistingName = { ...fakeRoom, name: existingRoomName };
    mockedAxios.get.mockResolvedValue({ data: roomWithExistingName });
    expect(checkRoomName(existingRoomName)).rejects.toThrow('Room name already taken');
  });
  it('should call checkRoomName with fake axios and return true as the room name is unique', async () => {
    const uniqueRoomName = 'ro_om';
    mockedAxios.get.mockResolvedValue({ data: '' }); // When room name is not taken, response returns { data: "" }
    expect(checkRoomName(uniqueRoomName)).resolves.toBe(true);
  });
});

describe('isRoomPlayersLimitAvailable', () => {
  it('should return true for room players number less than maxPlayersLimit', async () => {
    // Only one player in the room => return true
    mockedAxios.get.mockResolvedValue({ data: fakeRoom });
    expect(isRoomPlayersLimitAvailable(fakeRoom.name)).resolves.toBe(true);
  });
  it('should throw an error for room players limit exceeding maxPlayersLimit', async () => {
    // More than max limit of players in the room => throw an error
    mockedAxios.get.mockResolvedValue({ data: fakeRoom });
    expect(isRoomPlayersLimitAvailable(fakeRoom.name)).rejects.toThrow('Too many players in the room');
  });
});

describe('composeSoloRoomName', () => {
  const usernameValid = 'masha';
  const usernameNotValid1 = undefined;

  it('should return solo room name for valid username', () => {
    expect(composeSoloRoomName(usernameValid)).toEqual('solo_masha');
  });
  it('should return solo room name for not valid username', () => {
    expect(composeSoloRoomName(usernameNotValid1)).toContain('solo_');
  });
});

