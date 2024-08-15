import React, { useEffect, useRef, useState } from 'react';
import { LogBox } from 'react-native'; 
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './src/screen/Home';
import Todo_screen from './src/screen/Todo_screen';
import Gpa_calc from './src/screen/Gpa_calc';
import Timetable from './src/screen/Timetable';
import Reading_tips from './src/screen/Reading_tips';
import Set_milestones from './src/screen/Set_milestones'
import Map_screen from './src/screen/Map_screen';
import { COLORS, FONT, SIZES,icons,images} from "./constants"
import { ScreenHeaderBtn} from './components'
import { StyleSheet,TouchableOpacity,Text, View,SafeAreaView,ScrollView,Image } from 'react-native';
import { Icon } from 'react-native-paper';
import Calendar from './src/screen/Calendar';
import LoginScreen from './src/screen/Login';
import RegisterScreen from './src/screen/registration';
import ProfileScreen from './src/screen/profile';
import useCurrentTime from './src/hooks/useCurrentTime';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { db, auth } from './db/db_config'; 
import { getDoc,doc } from "firebase/firestore";
import MealPlanner from './src/screen/MealPlanner';

LogBox.ignoreAllLogs(); 

const stack =createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export default function App() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [username, setUsername] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  const currentTime = useCurrentTime();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUsername(userDoc.data().name);
            console.log(userDoc.data().name);
            scheduleDailyNotifications(userDoc.data().name);
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, []);

  const scheduleDailyNotifications = async (username) => {
    const scheduleAtSpecificTime = async (hours, minutes) => {
      const schedulingOptions = {
        content: {
          title: "Hey " + username,
          body: "Remember to check your reading timetable!",
          sound: 'default',
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      };
      await Notifications.scheduleNotificationAsync(schedulingOptions);
    };

    await scheduleAtSpecificTime(8, 0);  // 8:00 AM
    await scheduleAtSpecificTime(12, 0); // 12:00 PM
    await scheduleAtSpecificTime(17, 0); // 5:00 PM
  };


  
  return (
    <NavigationContainer >
      <stack.Navigator initialRouteName='Login' screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: COLORS.covenant, },
        headerTitleAlign: "center",
        headerRight: () => (
          <View style={{ padding: SIZES.medium }}>
            <ScreenHeaderBtn
              iconurl={images.profile}
              dimension="100%"
              onPress={() => navigation.navigate('profile')}
            />
          </View>
        ),
      })}>
        <stack.Screen name='Home' component={Home}options={{headerLeft : () => (
              <View style ={{padding:SIZES.medium}}>
                <Text style={{fontSize:20,fontStyle:'italic',color:COLORS.white}}>{currentTime}</Text>
              </View>
          ),
          }}/>
        <stack.Screen name='Todo_screen' component={Todo_screen}/>
        <stack.Screen name='Timetable' component={Timetable}/>
        <stack.Screen name='Gpa_calc' component={Gpa_calc}/>
        <stack.Screen name='Reading_tips' component={Reading_tips}/>
        <stack.Screen name='Set_milestones' component={Set_milestones}/>
        <stack.Screen name='Calendar' component={Calendar}/>
        <stack.Screen name='profile' component={ProfileScreen}/>
        <stack.Screen name='Map_screen' component={Map_screen}/>
        <stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <stack.Screen name='MealPlanner' component={MealPlanner}/>
        
        

      </stack.Navigator>
    </NavigationContainer>
  );
}
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}