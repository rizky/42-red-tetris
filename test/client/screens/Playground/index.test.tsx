import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Playground from '/client/screens/Playground/index';

describe.skip('Snapshots', () => {
  it.skip('should render Playground', () => {
    const wrapper = shallow(<Playground />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
