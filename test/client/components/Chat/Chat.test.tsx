import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { ChatWidget } from '/client/components/Chat';

describe('Snapshots', () => {
  it('should render ChatWidget', () => {
    const props = {
      title: 'Chat title',
      subtitle: 'Chat subtitle',
      handleNewUserMessage: jest.fn(),
    };

    const wrapper = shallow(<ChatWidget {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
