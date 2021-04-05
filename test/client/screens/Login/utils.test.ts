import { isEmpty, checkTextLength, checkSpecialChars, checkUsername, checkRoomName } from '/client/screens/Login/utils';

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
  const undefinedValue = undefined;
  const emptyStringValue = '';
  const nullValue = null;
  const specialCharacterUsername1 = 'n@pe';
  const specialCharacterUsername2 = 'a b';
  const correctUsernme1 = 'ma_sha';
  const correctUsernme2 = 'kotik123';

  it('should throw an error for undefinedValue', () => {
    expect(checkUsername(undefinedValue)).rejects.toThrow(Error('Name must be 1-15 symbols'));
  });
  it('should throw an error for emptyStringValue', () => {
    expect(checkUsername(emptyStringValue)).rejects.toThrow(Error('Name must be 1-15 symbols'));
  });
  it('should throw an error for nullValue', () => {
    expect(checkUsername(nullValue)).rejects.toThrow(Error('Name must be 1-15 symbols'));
  });
  it('should throw an error for specialCharacterUsername1', () => {
    expect(checkUsername(specialCharacterUsername1)).rejects.toThrow(Error('Use letters and numbers'));
  });
  it('should throw an error for specialCharacterUsername2', () => {
    expect(checkUsername(specialCharacterUsername2)).rejects.toThrow(Error('Use letters and numbers'));
  });
  it('should throw an error for correctUsernme1', () => {
    expect(checkUsername(correctUsernme1)).resolves.toBe(true);
  });
  it('should throw an error for correctUsernme2', () => {
    expect(checkUsername(correctUsernme2)).resolves.toBe(true);
  });
  // TODO: maybe add tests to check back responses
});

// describe('checkRoomName', () => {
//   it('should throw an error for undefinedValue', () => {
//     expect(checkRoomName('aaa')).rejects.toThrow(Error('Name must be 1-15 symbols'));
//   });
// });
