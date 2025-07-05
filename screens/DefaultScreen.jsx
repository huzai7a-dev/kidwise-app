import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../color';
import babyImg from '../assets/baby.png';
import { useNavigation } from '@react-navigation/core';

const fullDescription = "Kid Wise is an AI-powered learning companion designed to help your child grow through interactive lessons, friendly conversations, and fun educational games. Monitor progress, encourage creativity, and build habits that last a lifetime.";

const DefaultScreen = () => {
  const nav = useNavigation()
  const [displayedWords, setDisplayedWords] = useState([]);
  const words = fullDescription.split(' ');

  useEffect(() => {
    setDisplayedWords([])
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedWords((prev) => [...prev, words[index]]);
      index++;
      if (index >= words.length) clearInterval(interval);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={style.container}>
      <View style={{ position: 'relative' }}>
        <Image source={babyImg} />
        <View style={style.dot1}></View>
        <View style={style.dot2}></View>
      </View>

      <Text style={style.heading}>Kid <Text style={{ color: theme.orange }}>Wise</Text></Text>
      <Text style={style.para}>Smart Learning. Happy Growing.</Text>

      <Text style={style.description}>{displayedWords.join(' ')}</Text>

      <TouchableOpacity style={style.btn} onPress={()=>nav.navigate("login")}>
        <Text style={style.btnText}>GET STARTED</Text>
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
    fontSize: 32,
    marginTop: 20,
    color: theme?.black,
    fontWeight: '400',
  },
  para: {
    fontSize: 18,
    marginTop: 10,
    color: theme.gray,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  description: {
    fontSize: 16,
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
