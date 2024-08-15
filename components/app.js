// App.js
import React from 'react';
import ChatScreen from './ChatScreen';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const AppNavigator = createStackNavigator(
  {
    Chat: ChatScreen,
  },
  {
    initialRouteName: 'Chat',
  }
);

export default createAppContainer(AppNavigator);
