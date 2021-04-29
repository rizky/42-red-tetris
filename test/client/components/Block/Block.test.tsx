import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Block from '/client/components/Block';

describe('Snapshots', () => {
  it('should render Block with cellState.FREE', () => {
    const props = {
      value: 0,
    };
    const wrapper = shallow(<Block {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should render Block with cellState.OCCUPIED', () => {
    const props = {
      value: 1,
    };
    const wrapper = shallow(<Block {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should render Block with cellState.BLOCKED', () => {
    const props = {
      value: 2,
    };
    const wrapper = shallow(<Block {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
