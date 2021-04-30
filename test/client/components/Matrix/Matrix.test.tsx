import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Matrix from '/client/components/Matrix';
import { blankMatrix, blockMatrix } from '/client/constants/tetriminos';
import { blockCreate } from '/client/controllers/blockControllers';


describe('Snapshots', () => {
  it('should render blank Matrix with all props', () => {
    const props = {
      block: blockCreate({ type: 'T', pos: [0, 0] }),
      matrix: blankMatrix,
      style: { marginLeft: 10, borderWidth: 0, marginVertical: 10 },
      isSpectrum: undefined,
    };

    const wrapper = shallow(<Matrix {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render next block Matrix with all props', () => {
    const props = {
      block: blockCreate({ type: 'T', pos: [0, 0] }),
      matrix: blockMatrix,
      style: { marginLeft: 10, borderWidth: 0, marginVertical: 10 },
      isSpectrum: undefined,
    };

    const wrapper = shallow(<Matrix {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render spectrum Matrix', () => {
    const props = {
      block: blockCreate({ type: 'O', pos: [-10, -10] }),
      matrix: blankMatrix,
      style: undefined,
      isSpectrum: true,
    };

    const wrapper = shallow(<Matrix {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
