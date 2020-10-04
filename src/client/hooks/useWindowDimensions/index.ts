import { Dimensions, ScaledSize } from 'react-native';
import * as React from 'react';

type EventValue = {
  window: ScaledSize;
  screen: ScaledSize;
};

export const useDimensionsSync = (dim: 'window' | 'screen' = 'window'): { width: number, height: number } => {
  const [dimensions, setDimensions] = React.useState(() => Dimensions.get(dim));

  // Start listening to changes
  React.useEffect(() => {
    let stillCareAboutTheCallback = true;

    const updateDimensions = (nextDimensions: EventValue) => {
      stillCareAboutTheCallback && setDimensions(nextDimensions[dim]);
    };

    Dimensions.addEventListener('change', updateDimensions);

    return () => {
      stillCareAboutTheCallback = false;
      Dimensions.removeEventListener('change', updateDimensions);
    };
  }, [dim, setDimensions]);

  return dimensions;
};

export const useWindowDimensions = (): { width: number, height: number } => {
  return useDimensionsSync('window');
};
