/* eslint-disable @typescript-eslint/no-var-requires */

/*
 * This file defines the React 16 Adapter for Enzyme
*/
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({
  adapter: new Adapter(),
});

export const mockedNavigation = {
  canGoBack: jest.fn(),
  goBack: jest.fn(),
  navigate: jest.fn(),
  setOptions: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => mockedNavigation),
  useRoute: jest.fn(() => ({})),
}));
