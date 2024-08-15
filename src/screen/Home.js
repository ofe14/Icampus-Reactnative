import React, { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TouchableOpacity, Text, View, SafeAreaView, ScrollView, Image, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONT, SIZES } from "../../constants";
import Academic_calender from "../../components/common/cards/nearby/Academic_calender";
import Maps from "../../components/common/cards/nearby/Maps";
import Schedule from "../../components/common/cards/nearby/Schedule";
import Goals from "../../components/common/cards/nearby/Goals";
import Calculator from "../../components/common/cards/goals/calculator";
import Reading_timetable from "../../components/common/cards/goals/reading";
import Set_goals from "../../components/common/cards/goals/set_goals";
import Tips from "../../components/common/cards/goals/tips";
import Meals from "../../components/common/cards/nearby/Meal";
import Todo_screen from '../../src/screen/Todo_screen';
import { format } from 'date-fns';
import { useWindowDimensions } from 'react-native';
import { auth, db } from '../../db/db_config';
import { getFirestore, collection, query, where, onSnapshot,doc } from "firebase/firestore"; 
import NewtonCradleLoader from './loader';

const Home = () => {
  const [username, setUsername] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const currentDay = format(new Date(), 'EEEE');
          const q = query(collection(db, "Tasks"), where("userId", "==", user.uid), where("day", "==", currentDay));

          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(tasksData);
            setIsLoading(false);
          }, (error) => {
            console.error("Error fetching tasks: ", error);
            setError("Check your internet connection");
            setIsLoading(false);
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Error setting up task listener: ", error);
        setError("Check your internet connection");
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              setUsername(docSnapshot.data().name);
            } else {
              console.log('No such document!');
            }
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, []);

  const renderTask = ({ item }) => {
    const formattedTime = item.time && item.time.toDate ? format(item.time.toDate(), 'hh:mm a') : 'No time set';
    const formattedDate = item.time && item.time.toDate ? format(item.time.toDate(), 'MMMM do yyyy') : '';

    return (
      <TouchableOpacity style={styles.databox}>
        <Text style={styles.companyName} numberOfLines={1}>{item.task}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.jobName}>{formattedTime}</Text>
          <Text style={styles.jobName}>{formattedDate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const Fallback = () => (
    <View style={{ alignItems: "center", width: useWindowDimensions().width }}>
      <Image source={require("../../assets/icons/lazy.png")} style={{ height: 150, width: 150 }} />
    </View>
  );

  return (
    <SafeAreaView>
      <ScrollView vertical showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.userName}>Hello {username}</Text>
          <Text style={styles.welcomeMessage}>How are you doing today?</Text>
        </View>
        <View style={styles.container34}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Upcoming Tasks</Text>
            <TouchableOpacity onPress={() => navigation.navigate(Todo_screen)}>
              <Text style={styles.headerBtn}>Show all</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 155 }}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <NewtonCradleLoader />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <FlatList
              data={tasks}
              renderItem={renderTask}
              keyExtractor={(item) => item.id}
              horizontal
              ListEmptyComponent={Fallback}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollview}
            />
          )}
        </View>
        <View>
          <View style={styles.header3}>
            <Text style={styles.headerTitle3}>Features</Text>
          </View>
          <View style={styles.cardsContainer}>
            <Maps />
            <Academic_calender />
            <Schedule />
            <Set_goals />
            <Reading_timetable />
            <Tips />
            <Calculator />
            <Meals />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  header3: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SIZES.small,
  },
  headerTitle3: {
    fontSize: SIZES.large,
    fontFamily: FONT.medium,
    color: COLORS.primary,
    padding: 10,
  },
  cardsContainer: {
    marginTop: SIZES.medium,
    gap: SIZES.small,
    padding: 10,
  },
  userName: {
    justifyContent: "flex-start",
    fontFamily: FONT.regular,
    fontSize: SIZES.xxLarge,
    color: COLORS.secondary,
  },
  welcomeMessage: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginTop: 10,
  },
  container: {
    width: '50%',
    flexDirection: "row",
  },
  container34: {
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.medium,
    color: COLORS.primary,
    paddingLeft: 10,
  },
  headerBtn: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.gray,
    paddingRight: 10,
  },
  box1: {
    width: '150%',
    height: "100%",
  },
  inner: {
    flex: 1,
    padding: 10,
  },
  companyName: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.white,
    marginTop: SIZES.small / 1.5,
  },
  infoContainer: {
    marginTop: SIZES.large,
  },
  jobName: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.white,
  },
  databox: {
    height: 140,
    width: 150,
    borderColor: COLORS.gray,
    borderWidth: 1,
    margin: 5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "left",
    padding: 5,
    backgroundColor: COLORS.covenant,
  },
  scrollview: {
    height: 150,
    marginTop: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  headerContainer: {
    backgroundColor: COLORS.covenant,
    padding: SIZES.large,
    borderBottomLeftRadius: 130,
    borderBottomRightRadius: 130,
    marginBottom: SIZES.medium,
    alignItems: 'center',
  },
  userName: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.white,
  },
  welcomeMessage: {
    fontFamily: FONT.regular,
    fontSize: SIZES.large,
    color: COLORS.white,
    marginTop: 5,
  },
  loadingContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.red,
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
  },
});

export default Home;
