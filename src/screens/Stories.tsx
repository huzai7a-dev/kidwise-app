import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Video from 'react-native-video';
import { RouteProp, useRoute } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import { RootStackParamList } from '@src/types/navigation';

type StoriesRouteProp = RouteProp<RootStackParamList, 'stories'>;

const Stories = () => {
  const route = useRoute<StoriesRouteProp>();
  const { id } = route.params;

  useEffect(() => {
    Orientation.unlockAllOrientations();
    StatusBar.setHidden(true, 'slide');

    return () => {
      Orientation.lockToPortrait();
      StatusBar.setHidden(false);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Video
        source={require('@assets/story.mp4')}
        style={styles.video}
        resizeMode="contain"
        controls
        fullscreen
        paused={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default Stories;
