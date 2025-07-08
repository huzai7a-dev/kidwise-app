import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/core';
import type { RootStackParamList } from '@src/types/navigation';

import { theme } from '@constants/colors';
import babyImg from '@assets/baby.png';
import KWText from '../components/KWText';

const fullDescription = "Kid Wise is an AI-powered learning companion designed to help your child grow through interactive lessons, friendly conversations, and fun educational games. Monitor progress, encourage creativity, and build habits that last a lifetime.";

const DefaultScreen = () => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();


  const [displayedWords, setDisplayedWords] = useState([]);
  const words = fullDescription.split(' ');


  // useEffect(() => {
  //   setDisplayedWords([])
  //   let index = 0;
  //   const interval = setInterval(() => {
  //     setDisplayedWords((prev) => [...prev, words[index]]);
  //     index++;
  //     if (index >= words.length) clearInterval(interval);
  //   }, 150);

  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(()=> {
  //   kwGetUserById()
  // },[])
  return (
    <View style={style.container}>
      <View style={{ position: 'relative' }}>
        <Image source={babyImg} />
        <View style={style.dot1}></View>
        <View style={style.dot2}></View>
      </View>

      <KWText variant="heading" style={style.heading}>
        Kid <KWText color={theme.orange}>Wise</KWText>
      </KWText>
      <KWText variant="subtitle" style={style.para}>Smart Learning. Happy Growing.</KWText>

      <KWText variant="body" style={style.description}>{displayedWords.join(' ')}</KWText>

      <TouchableOpacity style={style.btn} onPress={()=>nav.navigate("login")}>
        <KWText style={style.btnText}>GET STARTED</KWText>
      </TouchableOpacity>
    </View>
  );
};

export default DefaultScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  dot1: {
    position: 'absolute',
    bottom: 10,
    left: 30,
    backgroundColor: theme.pink,
    width: 20,
    height: 20,
    borderRadius: 100,
  },
  dot2: {
    position: 'absolute',
    bottom: 70,
    right: 0,
    backgroundColor: theme.purple,
    width: 20,
    height: 20,
    borderRadius: 100,
  },
  heading: {
    marginTop: 20,
    color: theme?.black,
    fontWeight: '400',
  },
  para: {
    marginTop: 10,
    color: theme.gray,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  description: {
    marginTop: 20,
    textAlign: 'left',
    lineHeight: 24,
    color: theme?.black,
  },
  btn: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: theme.orange,
    width: '100%',
    height: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },

  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
