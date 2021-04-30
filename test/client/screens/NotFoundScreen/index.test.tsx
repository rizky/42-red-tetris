import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import NotFoundScreen from '/client/screens/NotFoundScreen';

describe('Snapshots', () => {
  it('should render NotFoundScreen screen', () => {
    const wrapper = shallow(<NotFoundScreen />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
