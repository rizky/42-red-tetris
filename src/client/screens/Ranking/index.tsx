import  React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import { StyleSheet, View, Text } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

import Gameboy from '/client/components/Gameboy';
import { SOCKETS } from '/config/constants';
import SocketContext from '/client/context/SocketContext';
import UserContext from '/client/context/UserContext';

type Props = {
	// players: PlayerType[],
};

const Ranking = (props: Props): JSX.Element => {
  // const {players} = props;

  const socket = useContext(SocketContext);
  const { userContext, setUserContext } = useContext(UserContext);

  const route = useRoute<RouteProp<RootStackParamList, 'Playground'>>();
  const { params } = route;
  // const { room, username } = userContext;
  const { room, username } = params ?? {};
  const [roomPlayers, setRoomPlayers] = useState<PlayerType[]>([]);

  console.log('roomPlayers:', roomPlayers);

  const socketAccessForbidden = () => {
    console.log('aaaaaaaaaaaa forbidden');
  };

  const socketFetchRoomRanking = (players: PlayerType[]) => {
    setRoomPlayers(players);
  };


  useEffect(() => {
    if (!socket) throw Error('No socket');
    // TODO: Here I tested how I can forbid access to pages that I entered fom URL but sis not create. Uncomment it at the end of development
    // socket.emit(SOCKETS.FETCH_ROOM_RANKING, {username, roomName: room, gameMode: 'not solo'});
    socket.emit(SOCKETS.FETCH_ROOM_RANKING, {username, roomName: room, gameMode: 'not solo'});
    socket.on(SOCKETS.FORBIDDEN, socketAccessForbidden);
    socket.on(SOCKETS.FETCH_ROOM_RANKING, socketFetchRoomRanking);

    return () => {
      socket.removeListener(SOCKETS.FORBIDDEN, socketAccessForbidden);
      socket.removeListener(SOCKETS.FETCH_ROOM_RANKING, socketFetchRoomRanking);
    };
  }, []);

  const rankedPlayers = [{ username: 'sqss', room: '1', id: 'aaa', score: 22800 }, { username: 'bbb', room: '1', id: 'bbb', score: 12003 }, { username: 'ccc', room: '1', id: 'acccaa', score: 5453 }, { username: 'ddd', room: '1', id: 'acccaa', score: 5453 }, { username: 'eee', room: '1', id: 'acccaa', score: 5453 }, { username: 'fff', room: '1', id: 'acccaa', score: 5453 }, { username: 'ggg', room: '1', id: 'acccaa', score: 5453 }, { username: 'hhh', room: '1', id: 'acccaa', score: 5453 },{ username: 'iii', room: '1', id: 'acccaa', score: 5453 }, { username: 'jjj', room: '1', id: 'acccaa', score: 5453 }];

  return (
    <Gameboy>
      <View style={{ justifyContent: 'space-between' }}>
        <Text style={styles.title}>Game report</Text>
        {/* {_.map(roomPlayers, (player) => <Text>{player}</Text>)} */}
        {username === rankedPlayers[0].username
          ? <Text style={styles.subtitle}>{username}, you are the winner!</Text>
          : <Text style={styles.subtitle}>{username} @ {room}</Text>}
        <View style={styles.tableContainer}>
          <View>
            <Text style={styles.tableHeader}>Place</Text>
            {_.map(rankedPlayers, (_, index) =>
              <Text key={index} style={styles.tableContent}>{index + 1}</Text>)}
          </View>
          <View>
            <Text style={styles.tableHeader}>Name</Text>
            {_.map(rankedPlayers, (player, index) =>
              <Text key={index} style={styles.tableContent}>{player.username}</Text>)}
          </View>
          <View>
            <Text style={styles.tableHeader}>Lines</Text>
            {_.map(rankedPlayers, (player, index) =>
              <Text key={index} style={styles.tableContent}>{Math.floor(player.score / 10)}</Text>)}
          </View>
          <View>
            <Text style={styles.tableHeader}>Score</Text>
            {_.map(rankedPlayers, (player, index) =>
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
