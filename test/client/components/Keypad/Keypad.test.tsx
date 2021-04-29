import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Keypad from '/client/components/Keypad';

describe('Snapshots', () => {
  it('should render Keypad for Login and Ranking screens', () => {
    const props = {
      isPause: undefined,
      setIsPause: undefined,
      opponentsNumber: 0,
      isLeader: undefined,
      gameStarted: undefined,
      gameover: undefined,
      isSoloMode: undefined,
      speedMode: undefined,
    };

    const wrapper = shallow(<Keypad {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render Keypad for Multiplayer Playground screen: isLeader, not gameStarted, isPause', () => {
    const props = {
      gameover: false,
      gameStarted: false,
      isLeader: true,
      isPause: true,
      isSoloMode: false,
      opponentsNumber: 2,
      setIsPause: jest.fn(),
      speedMode: false,
    };

    const wrapper = shallow(<Keypad {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render Keypad for Multiplayer Playground screen: not isLeader, not gameStarted, isPause', () => {
    const props = {
      gameover: false,
      gameStarted: false,
      isLeader: false,
      isPause: true,
      isSoloMode: false,
      opponentsNumber: 2,
      setIsPause: jest.fn(),
      speedMode: false,
    };

    const wrapper = shallow(<Keypad {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render Keypad for Multiplayer Playground screen: isLeader, gameStarted, not isPause', () => {
    const props = {
      gameover: false,
      gameStarted: true,
      isLeader: true,
      isPause: false,
      isSoloMode: false,
      opponentsNumber: 2,
      setIsPause: jest.fn(),
      speedMode: false,
    };

    const wrapper = shallow(<Keypad {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render Keypad for Multiplayer Playground screen: not isLeader, gameStarted, not isPause', () => {
    const props = {
      gameover: false,
      gameStarted: true,
      isLeader: false,
      isPause: false,
      isSoloMode: false,
      opponentsNumber: 2,
      setIsPause: jest.fn(),
      speedMode: false,
    };

    const wrapper = shallow(<Keypad {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render Keypad for Multiplayer Playground screen: not isLeader, gameStarted, isPause, gameover', () => {
    const props = {
      gameover: true,
      gameStarted: true,
      isLeader: false,
      isPause: true,
      isSoloMode: false,
      opponentsNumber: 2,
      setIsPause: jest.fn(),
      speedMode: false,
    };

    const wrapper = shallow(<Keypad {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render Keypad for Solo Playground screen: not gameStarted, isPause', () => {
    const props = {
      gameover: false,
      gameStarted: false,
      isLeader: true,
      isPause: true,
      isSoloMode: true,
      opponentsNumber: 0,
      setIsPause: jest.fn(),
      speedMode: false,
    };

    const wrapper = shallow(<Keypad {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render Keypad for Solo Playground screen: gameStarted, not isPause', () => {
    const props = {
      gameover: false,
      gameStarted: true,
      isLeader: true,
      isPause: false,
      isSoloMode: true,
      opponentsNumber: 0,
      setIsPause: jest.fn(),
      speedMode: false,
    };

    const wrapper = shallow(<Keypad {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render Keypad for Solo Playground screen: gameStarted, isPause', () => {
    const props = {
      gameover: false,
      gameStarted: true,
      isLeader: true,
      isPause: true,
      isSoloMode: true,
      opponentsNumber: 0,
      setIsPause: jest.fn(),
      speedMode: false,
    };

    const wrapper = shallow(<Keypad {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
