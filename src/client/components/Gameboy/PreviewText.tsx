import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '/client/components/Gameboy';

type Props = {
  isMultiplayerMode: boolean,
  opponentsNumber: number,
  isLeader?: boolean,
  gameover?: boolean,
}

const PreviewText = (props: Props): JSX.Element  => {
  const { isMultiplayerMode, opponentsNumber, isLeader, gameover } = props;
  const secondLineText = (opponentsNumber: number, isLeader?: boolean) => {
    if (opponentsNumber <= 0) return 'Wait for other players';
    if (opponentsNumber > 0 && isLeader) return 'Press Start to begin';
    if (opponentsNumber > 0 && !isLeader) return 'Wait for leader to start the game';
  };

  if (gameover) {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.gameover}>Game Over</Text>
        <Text style={styles.gameMode}>Please wait for other players to finish</Text>
      </View>
    );
  }
  if (isMultiplayerMode) {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.gameMode}>You are in multiplayer mode</Text>
        <Text style={styles.gameMode}>{opponentsNumber} other player(s) in your room</Text>
        <Text>{secondLineText(opponentsNumber, isLeader)}</Text>
      </View>
    );
  }
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.gameMode}>You are in solo mode</Text>
      <Text>Press Play(P) to start</Text>
    </View>
  );
};

export default PreviewText;
