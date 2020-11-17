import  React, { useState } from 'react';
import { View } from 'react-native';

import ChooseUsername from '/client/screens/Login/ChooseUsername';
import ChooseRoom from '/client/screens/Login/ChooseRoom';
import Gameboy from '/client/components/Gameboy';

export default function Login(): JSX.Element {
  const [screenNumber, setScreenNumber] = useState<1 | 2>(1);

  return (
    <Gameboy>
      <View style={{ alignItems: 'center', width: '60%' }}>
        {screenNumber === 1
          ? <ChooseUsername setScreenNumber={setScreenNumber} />
          : <ChooseRoom setScreenNumber={setScreenNumber} />
        }
      </View>
    </Gameboy>
  );
}