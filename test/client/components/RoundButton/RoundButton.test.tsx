import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import RoundButton from '/client/components/RoundButton';

describe('Snapshots', () => {
  it('should render RoundButton with all props', () => {
    const props = {
      size: 50,
      color: 'red',
      label: 'Button',
      style: { marginTop: 20 },
      onPress: jest.fn(),
      disabled: false,
      text: '🎶',
    };

    const wrapper = shallow(<RoundButton {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render RoundButton with just necessary props', () => {
    const props = {
      size: 50,
      color: 'red',
      label: undefined,
      style: undefined,
      onPress: undefined,
      disabled: undefined,
      text: undefined,
    };

    const wrapper = shallow(<RoundButton {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
