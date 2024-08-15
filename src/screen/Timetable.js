import { ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, FlatList, Alert, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { IconButton } from "react-native-paper";
import { COLORS } from '../../constants';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Fallback from "../components/Fallback";
import { NavigationContainer } from "@react-navigation/native";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { SIZES, FONT } from '../../constants';
import { db } from '../config/firestore';
import NewtonCradleLoader from "./loader";
import { auth } from '../../db/db_config';

const Timetable = () => {
  const [timetable, setTimetable] = useState(generateInitialTimetable());
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'timetable'), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedTimetable = generateInitialTimetable();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const { day, time, task } = data;
          const dayIndex = getDayIndex(day);
          const timeSlotIndex = getTimeSlotIndex(time);
          if (dayIndex !== -1 && timeSlotIndex !== -1) {
            fetchedTimetable[timeSlotIndex][dayIndex] = { id: doc.id, task };
          }
        });
        setTimetable(fetchedTimetable);
      }
    } catch (error) {
      console.error("Error fetching timetable: ", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (dayIndex, timeSlotIndex, text) => {
    const newTimetable = [...timetable];
    newTimetable[timeSlotIndex][dayIndex] = { ...(newTimetable[timeSlotIndex][dayIndex] || {}), task: text };
    setTimetable(newTimetable);

    const change = { dayIndex, timeSlotIndex, text };
    setChanges((prevChanges) => [...prevChanges, change]);
  };

  const applyChanges = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        for (const change of changes) {
          const { dayIndex, timeSlotIndex, text } = change;
          const cellData = timetable[timeSlotIndex][dayIndex];
          const day = getDayName(dayIndex);
          const time = getTimeSlotName(timeSlotIndex);

          if (text.trim() === "") {
            if (cellData.id) {
              await deleteDoc(doc(db, 'timetable', cellData.id));
            }
            timetable[timeSlotIndex][dayIndex] = "";
          } else {
            if (cellData.id) {
              await updateDoc(doc(db, 'timetable', cellData.id), { day, time, task: text });
            } else {
              const docRef = await addDoc(collection(db, 'timetable'), { day, time, task: text, userId: user.uid });
              timetable[timeSlotIndex][dayIndex] = { id: docRef.id, task: text };
            }
          }
        }
        setChanges([]);
        Alert.alert('Success', 'Timetable updated successfully!');
      }
    } catch (error) {
      console.error("Error updating timetable: ", error);
      setError(error);
      Alert.alert('Error', 'Failed to update timetable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScrollView horizontal>
        <View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.headerCell]}></Text>
            <Text style={[styles.cell, styles.headerCell]}>Monday</Text>
            <Text style={[styles.cell, styles.headerCell]}>Tuesday</Text>
            <Text style={[styles.cell, styles.headerCell]}>Wednesday</Text>
            <Text style={[styles.cell, styles.headerCell]}>Thursday</Text>
            <Text style={[styles.cell, styles.headerCell]}>Friday</Text>
            <Text style={[styles.cell, styles.headerCell]}>Saturday</Text>
          </View>
          {generateRows(timetable, handleInputChange)}
        </View>
      </ScrollView>
      <View style={{ height: 70 }}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <NewtonCradleLoader />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <Button title="Update Timetable" onPress={applyChanges} />
        )}
      </View>
    </ScrollView>
  );
};

const generateInitialTimetable = () => {
  const days = 6; // Monday to Saturday
  const timeSlots = 13; // Number of time slots
  return Array.from({ length: timeSlots }, () => Array(days).fill(''));
};

const generateRows = (timetable, handleInputChange) => {
  const timeSlots = [
    '8-9am', '9-10am', '10-11am', '11-12am', '12-1pm', '1-2pm', '2-3pm', '3-4pm', '4-5pm', '5-6pm', '6-7pm', '7-8pm', '8-9pm'
  ];
  return timeSlots.map((slot, timeSlotIndex) => (
    <View style={styles.row} key={timeSlotIndex}>
      <Text style={[styles.cell, styles.timeCell]}>{slot}</Text>
      {timetable[timeSlotIndex].map((cellData, dayIndex) => (
        <TextInput
          key={dayIndex}
          style={[styles.cell, styles.inputCell]}
          value={cellData.task || ""}
          onChangeText={(text) => handleInputChange(dayIndex, timeSlotIndex, text)}
          multiline
        />
      ))}
    </View>
  ));
};

const getDayIndex = (day) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days.indexOf(day);
};

const getTimeSlotIndex = (time) => {
  const timeSlots = ['8-9am', '9-10am', '10-11am', '11-12am', '12-1pm', '1-2pm', '2-3pm', '3-4pm', '4-5pm', '5-6pm', '6-7pm', '7-8pm', '8-9pm'];
  return timeSlots.indexOf(time);
};

const getDayName = (dayIndex) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
};

const getTimeSlotName = (timeSlotIndex) => {
  const timeSlots = ['8-9am', '9-10am', '10-11am', '11-12am', '12-1pm', '1-2pm', '2-3pm', '3-4pm', '4-5pm', '5-6pm', '6-7pm', '7-8pm', '8-9pm'];
  return timeSlots[timeSlotIndex];
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
    borderColor: '#000',
    textAlign: 'center',
    justifyContent: 'flex-end', // Ensure text is aligned to the bottom
    width: 150, // Specific width for all cells
  },
  headerCell: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    width: 150, // Specific width for header cells
  },
  inputCell: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    textAlign: 'center',
    backgroundColor: '#fff',
    width: 150, // Specific width for input cells
    height: 60, // Custom height for input cells
    justifyContent: 'flex-end', // Align text to the bottom
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

export default Timetable;
