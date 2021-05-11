import  React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import { StyleSheet, View, Text } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import Gameboy from '/client/components/Gameboy';
import { SOCKETS } from '/config/constants';
import SocketContext from '/client/context/SocketContext';

const Ranking = (): JSX.Element => {
  const { socketContext: socket } = useContext(SocketContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Playground'>>();

  const route = useRoute<RouteProp<RootStackParamList, 'Ranking'>>();
  const { params } = route;
  const { room, username } = params ?? {};
  const [rankedRoomPlayers, setRoomPlayers] = useState<PlayerType[]>([]);

  const socketReceiveRoomRanking = (players: PlayerType[]) => {
    setRoomPlayers(players);
  };


  useEffect(() => {
    if (!socket) return navigation.replace('Home');
    socket.emit(SOCKETS.FETCH_ROOM_RANKING, { username, roomName: room });
    socket.on(SOCKETS.FETCH_ROOM_RANKING, socketReceiveRoomRanking);

    return () => {
      socket.emit(SOCKETS.PLAYER_LEFT, username);
      socket.removeListener(SOCKETS.FETCH_ROOM_RANKING, socketReceiveRoomRanking);
    };
  }, []);

  return (
    <Gameboy>
      <View style={{ justifyContent: 'space-between' }}>
        <Text style={styles.title}>Game report</Text>
        {username && rankedRoomPlayers.length > 1 && (username === rankedRoomPlayers[0].username)
          ? <Text style={styles.subtitle}>{username}, you are the winner!</Text>
          : <Text style={styles.subtitle}>{username} @ {room}</Text>
        }
        <View style={styles.tableContainer}>
          <View>
            <Text style={styles.tableHeader}>Place</Text>
            {_.map(rankedRoomPlayers, (_, index) =>
              <Text key={index} style={styles.tableContent}>{index + 1}</Text>)}
          </View>
          <View>
            <Text style={styles.tableHeader}>Name</Text>
            {_.map(rankedRoomPlayers, (player, index) =>
              <Text key={index} style={styles.tableContent}>{player.username}</Text>)}
          </View>
          <View>
            <Text style={styles.tableHeader}>Score</Text>
            {_.map(rankedRoomPlayers, (player, index) =>
              <Text key={index} style={styles.tableContent}>{player.score}</Text>)}
          </View>
        </View>
      </View>
    </Gameboy>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: '10%',
  },
  subtitle: {
    fontSize: 24,
    alignSelf: 'center',
    marginBottom: '10%',
  },
  tableContainer: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableContent: {
    fontSize: 18,
    marginBottom: 3,
    marginTop: 3,
  },
});

export default Ranking;
