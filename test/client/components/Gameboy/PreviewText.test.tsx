import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import PreviewText from '/client/components/Gameboy/PreviewText';

describe('PreviewText', () => {
  it('should render PreviewText for solo mode', () => {
    const props = {
      isMultiplayerMode: false,
      opponentsNumber: 0,
    };
    const wrapper = shallow(<PreviewText {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should render PreviewText for Leader in multiplayer mode and no opponents', () => {
    const props = {
      isMultiplayerMode: true,
      opponentsNumber: 0,
      isLeader: true,
      gameover: false,
    };
    const wrapper = shallow(<PreviewText {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should render PreviewText for not Leader in multiplayer mode and no opponents', () => {
    const props = {
      isMultiplayerMode: true,
      opponentsNumber: 0,
      isLeader: false,
      gameover: false,
    };
    const wrapper = shallow(<PreviewText {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should render PreviewText for Leader in multiplayer mode with opponents', () => {
    const props = {
      isMultiplayerMode: true,
      opponentsNumber: 2,
      isLeader: true,
      gameover: false,
    };
    const wrapper = shallow(<PreviewText {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should render PreviewText for not Leader in multiplayer mode with opponents', () => {
    const props = {
      isMultiplayerMode: true,
      opponentsNumber: 2,
      isLeader: false,
      gameover: false,
    };
    const wrapper = shallow(<PreviewText {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should render PreviewText for Leader in multiplayer mode after gameover', () => {
    const props = {
      isMultiplayerMode: true,
      opponentsNumber: 1,
      isLeader: true,
      gameover: true,
    };
    const wrapper = shallow(<PreviewText {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should render PreviewText for not Leader in multiplayer mode after gameover', () => {
    const props = {
      isMultiplayerMode: true,
      opponentsNumber: 1,
      isLeader: false,
      gameover: true,
    };
    const wrapper = shallow(<PreviewText {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
