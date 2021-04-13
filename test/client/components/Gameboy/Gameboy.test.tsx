import React from 'react';
import { Text, View } from 'react-native';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Gameboy from '/client/components/Gameboy';

describe('Snapshots', () => {
  it('should render Gameboy', () => {
    const wrapper = shallow(<Gameboy><View><Text>aaa</Text></View></Gameboy>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
