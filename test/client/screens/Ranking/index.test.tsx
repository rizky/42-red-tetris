import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Ranking from '/client/screens/Ranking';

describe('Snapshots', () => {
  it('should render Ranking screen', () => {
    const wrapper = shallow(<Ranking />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
