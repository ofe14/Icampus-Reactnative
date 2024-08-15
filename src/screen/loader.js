import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const NewtonCradleLoader = () => {
  const animatedValues = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  useEffect(() => {
    animatedValues.forEach((animatedValue, index) => {
      animatedValue.value = withRepeat(
        withTiming(1, {
          duration: 1200, // increased duration for a smoother wave
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    });
  }, []);

  const ballStyle = (animatedValue, index) => useAnimatedStyle(() => ({
    transform: [
      {
        translateY: Math.sin(animatedValue.value * Math.PI * 2 + index * Math.PI / 2) * -20,
      },
    ],
  }));

  return (
    <View style={styles.container}>
      {animatedValues.map((animatedValue, index) => (
        <Animated.View key={index} style={[styles.ball, ballStyle(animatedValue, index)]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80,
    height: 40,
  },
  ball: {
    width: 16,
    height: 16,
    borderRadius:8,
    backgroundColor: 'black',
  },
});

export default NewtonCradleLoader;
