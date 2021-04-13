import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ChooseUsername from '/client/screens/Login/ChooseUsername';
import ChooseRoom from '/client/screens/Login/ChooseRoom';
import Login from '/client/screens/Login/index';

describe('Snapshots', () => {
  let props: JSX.IntrinsicAttributes & { setScreenNumber: React.Dispatch<React.SetStateAction<1 | 2>>; };

  beforeEach(() => {
    props = {
      setScreenNumber: jest.fn(() => 1),
    };
  });
  it('should render ChooseUsername', () => {
    const wrapper = shallow(<ChooseUsername {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should render ChooseRoom', () => {
    const wrapper = shallow(<ChooseRoom {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should render Login', () => {
    const wrapper = shallow(<Login/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
