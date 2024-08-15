import {ScrollView, StyleSheet,Text,TextInput,View,TouchableOpacity, FlatList, Alert, Button,ImageBackground,FastImage,resizeMode} from "react-native";
import React, { useState,useEffect} from "react";
import { IconButton } from "react-native-paper";
import { COLORS } from '../../constants'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Fallback from "../components/Fallback";
import { NavigationContainer } from "@react-navigation/native";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import{db} from '../config/firestore'

const calendarData = [
  {
    month: 'September 2023',
    events: [
      { day: '17', event: 'UG Course Registration Begins' },
      { day: '20', event: 'Faculty/Staff Executive Advance' },
      { day: '25', event: 'Resumption for Freshmen Begins' },
      { day: '29', event: 'Induction/Orientation for Freshmen Begins' },
    ],
  },
  {
    month: 'October 2023',
    events: [
      { day: '1', event: 'Resumption for Freshmen Ends' },
      { day: '2', event: 'Resumption for Returning Students' },
      { day: '2', event: 'Course Registration Continues' },
      { day: '2', event: 'Induction/Orientation for Freshmen Ends' },
      { day: '2', event: 'Late Registration for Freshmen Begins' },
      { day: '6', event: 'Late Registration for Freshmen Ends' },
      { day: '9', event: 'Lectures Begin' },
    ],
  },
  {
    month: 'November 2023',
    events: [
      { day: '3', event: 'Course Registration Ends' },
      { day: '3', event: 'Submission of Workbooks for Registration' },
      { day: '6', event: 'Late Registration Begins' },
      { day: '10', event: 'Late Registration Ends' },
      { day: '13', event: 'Submission of First (CA) Scores' },
      { day: '20', event: 'Matriculation' },
      { day: '24', event: 'Lecture Ends' },
      { day: '27', event: 'Revision/Alpha Semester Exam Begins' },
    ],
  },
  {
    month: 'December 2023',
    events: [
      { day: '8', event: 'Alpha Semester Exam Ends' },
      { day: '11', event: 'Colloquium' },
      { day: '15', event: 'Senate' },
      { day: '15', event: 'Alpha Semester Break Begins' },
      { day: '15', event: 'Deadline for Submission of Alpha Semester Exam Scores' },
    ],
  },
  {
    month: 'January 2024',
    events: [
      { day: '2', event: 'Resumption from Alpha Semester Break' },
      { day: '2', event: 'Course Registration Begins' },
      { day: '8', event: 'Lecture Begins' },
      { day: '26', event: 'Course Registration Ends' },
      { day: '29', event: 'Late Registration Begins' },
    ],
  },
  {
    month: 'February 2024',
    events: [
      { day: '2', event: 'Late Registration Ends' },
      { day: '2', event: 'Submission of Workbooks for Registration' },
      { day: '5', event: 'Submission of First (CA) Scores' },
    ],
  },
  {
    month: 'March 2024',
    events: [
      { day: '29', event: 'Lecture Ends' },
    ],
  },
  {
    month: 'April 2024',
    events: [
      { day: '1', event: 'Revision/Alpha Semester Exam Begins' },
      { day: '12', event: 'Alpha Semester Exam Ends' },
      { day: '15', event: 'Colloquium' },
      { day: '19', event: 'Senate' },
      { day: '19', event: 'Alpha Semester Break Begins' },
      { day: '19', event: 'Deadline for Submission of Alpha Semester Exam Scores' },
    ],
  },
  {
    month: 'May 2024',
    events: [
      { day: '6', event: 'Resumption from Alpha Semester Break' },
      { day: '6', event: 'Course Registration Begins' },
      { day: '10', event: 'Course Registration Ends' },
      { day: '13', event: 'Late Registration Begins' },
      { day: '17', event: 'Late Registration Ends' },
      { day: '17', event: 'Submission of Workbooks for Registration' },
      { day: '20', event: 'Lecture Begins' },
    ],
  },
  {
    month: 'June 2024',
    events: [
      { day: '28', event: 'Lecture Ends' },
      { day: '28', event: 'Submission of Second (CA) Scores' },
    ],
  },
  {
    month: 'July 2024',
    events: [
      { day: '1', event: 'Revision/Alpha Semester Exam Begins' },
      { day: '12', event: 'Alpha Semester Exam Ends' },
      { day: '15', event: 'Colloquium' },
      { day: '19', event: 'Senate' },
      { day: '19', event: 'Alpha Semester Break Begins' },
      { day: '19', event: 'Deadline for Submission of Alpha Semester Exam Scores' },
    ],
  },
];

const Calendar = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={{ uri: 'https://example.com/your/large/image.jpg' }}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Academic Calendar</Text>
        </View>
        {calendarData.map((monthData, index) => (
          <View key={index} style={styles.monthContainer}>
            <Text style={styles.monthTitle}>{monthData.month}</Text>
            {monthData.events.map((event, idx) => (
              <View key={idx} style={styles.eventContainer}>
                <Text style={styles.eventDay}>{event.day}</Text>
                <Text style={styles.eventDescription}>{event.event}</Text>
              </View>
            ))}
          </View>
        ))}
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  monthContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingBottom: 5,
  },
  eventDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  eventDescription: {
    fontSize: 16,
    color: COLORS.black,
  },
});

export default Calendar;





