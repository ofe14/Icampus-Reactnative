import {Image,ScrollView, StyleSheet,Text,TextInput,View,TouchableOpacity,  Alert, Button, Modal, FlatList } from "react-native";
import React, { useState,useEffect} from "react";
import { IconButton } from "react-native-paper";
import { COLORS } from '../../constants'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Fallback from "../components/Fallback";
import { NavigationContainer } from "@react-navigation/native";
import { collection, addDoc, updateDoc, deleteDoc, doc,getDoc, getDocs, query, where, setDoc } from "firebase/firestore";
import{db} from '../config/firestore'


const Gpa_calc = () => {
  const [Calc_Title, setCalcTitle] = useState('');
  const [courses, setCourses] = useState([]);
  const [calculatedGpa, setCalculatedGpa] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [savedTitles, setSavedTitles] = useState([]);

  const addCourse = () => {
      setCourses([...courses, { course: '', credit: '', test1: '', test2: '', exam: '', grade: '', weighted: '' }]);
  };

  const handleInputChange = (index, field, value) => {
      const newCourses = [...courses];
      newCourses[index][field] = value;
      setCourses(newCourses);
  };

  const calculateGrade = (totalScore) => {
      if (totalScore >= 70) return 'A';
      if (totalScore >= 60) return 'B';
      if (totalScore >= 50) return 'C';
      if (totalScore >= 45) return 'D';
      return 'F';
  };

  const calculateWeightedScore = (credit, grade) => {
      const gradePoints = { 'A': 5, 'B': 4, 'C': 3, 'D': 1, 'F': 0 };
      return credit * gradePoints[grade];
  };

  const calculateOptimalScores = () => {
      const totalCredits = courses.reduce((sum, course) => sum + parseFloat(course.credit || 0), 0);
      let accumulatedPoints = 0;

      const newCourses = courses.map(course => {
          const credit = parseFloat(course.credit || 0);
          const test1 = parseFloat(course.test1 || 0);
          const test2 = parseFloat(course.test2 || 0);
          const exam = parseFloat(course.exam || 0);

          const totalAchievedScore = test1 + test2 + exam;
          const grade = calculateGrade(totalAchievedScore);
          const weighted = calculateWeightedScore(credit, grade);

          accumulatedPoints += weighted;

          return {
              ...course,
              grade,
              weighted: weighted.toFixed(2)
          };
      });

      setCourses(newCourses);
      setCalculatedGpa((accumulatedPoints / totalCredits).toFixed(2));
  };

  const saveToFirestore = async () => {
      try {
          if (!Calc_Title.trim()) {
              Alert.alert("Error", "Please enter a title before saving.");
              return;
          }
          const coursesData = courses.map(course => ({
              course: course.course,
              credit: parseInt(course.credit),
              test1: parseInt(course.test1),
              test2: parseInt(course.test2),
              exam: parseInt(course.exam)
          }));

          await setDoc(doc(db, "Goals", Calc_Title), {
              title: Calc_Title,
              courses: coursesData
          });

          Alert.alert("Success", "Data saved successfully!");
      } catch (error) {
          console.error("Error saving document: ", error);
          Alert.alert("Error", "Failed to save data.");
      }
  };

  const fetchSavedTitles = async () => {
      try {
          const querySnapshot = await getDocs(collection(db, "Goals"));
          const titles = querySnapshot.docs.map(doc => doc.id);
          setSavedTitles(titles);
      } catch (error) {
          console.error("Error fetching titles: ", error);
      }
  };

  const loadSelectedTitle = async (title) => {
      try {
          const docRef = doc(db, "Goals", title);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
              const data = docSnap.data();
              setCalcTitle(data.title);
              setCourses(data.courses.map(course => ({
                  ...course,
                  credit: course.credit.toString(),
                  test1: course.test1.toString(),
                  test2: course.test2.toString(),
                  exam: course.exam.toString()
              })));
              setModalVisible(false);
          } else {
              Alert.alert("Error", "No such document!");
          }
      } catch (error) {
          console.error("Error loading document: ", error);
          Alert.alert("Error", "Failed to load data.");
      }
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.titleContainer}>
              <TextInput
                  style={[styles.cell, styles.gpaInput]}
                  placeholder="Enter Title"
                  value={Calc_Title}
                  onChangeText={setCalcTitle}
              />
              <TouchableOpacity onPress={() => {
                    fetchSavedTitles();
                    setModalVisible(true);
                }}>
                    <Image source={require('../../assets/icons/folder.png')} style={styles.menuIcon} />
                </TouchableOpacity>
          </View>
          <ScrollView horizontal>
              <View>
                  <View style={styles.row}>
                      <Text style={[styles.cell, styles.headerCell]}>Courses</Text>
                      <Text style={[styles.cell, styles.headerCell]}>Credit unit</Text>
                      <Text style={[styles.cell, styles.headerCell]}>Test 1</Text>
                      <Text style={[styles.cell, styles.headerCell]}>Test 2</Text>
                      <Text style={[styles.cell, styles.headerCell]}>Exam</Text>
                      <Text style={[styles.cell, styles.headerCell]}>Grade</Text>
                      <Text style={[styles.cell, styles.headerCell]}>Weighted score</Text>
                  </View>
                  {courses.map((course, index) => (
                      <View style={styles.row} key={index}>
                          <TextInput
                              style={[styles.cell, styles.inputCell]}
                              value={course.course}
                              onChangeText={(text) => handleInputChange(index, 'course', text)}
                          />
                          <TextInput
                              style={[styles.cell, styles.inputCell]}
                              value={course.credit}
                              onChangeText={(text) => handleInputChange(index, 'credit', text)}
                              keyboardType="numeric"
                          />
                          <TextInput
                              style={[styles.cell, styles.inputCell]}
                              value={course.test1}
                              onChangeText={(text) => handleInputChange(index, 'test1', text)}
                              keyboardType="numeric"
                          />
                          <TextInput
                              style={[styles.cell, styles.inputCell]}
                              value={course.test2}
                              onChangeText={(text) => handleInputChange(index, 'test2', text)}
                              keyboardType="numeric"
                          />
                          <TextInput
                              style={[styles.cell, styles.inputCell]}
                              value={course.exam}
                              onChangeText={(text) => handleInputChange(index, 'exam', text)}
                              keyboardType="numeric"
                          />
                          <Text style={[styles.cell, styles.inputCell]}>{course.grade}</Text>
                          <Text style={[styles.cell, styles.inputCell]}>{course.weighted}</Text>
                      </View>
                  ))}
                  <View style={styles.buttonContainer}>
                  <Button title="Add Course" onPress={addCourse} />
                  </View>
              </View>

          </ScrollView>

          <View style={styles.buttonContainer}>
              <Button title="Save Instance" onPress={saveToFirestore} />
              <Button title="Calculate Scores" onPress={calculateOptimalScores} />
          </View>
          {calculatedGpa && (
              <View style={styles.gpaBox}>
                  <Text style={styles.gpaText}>Calculated GPA: {calculatedGpa}</Text>
              </View>
          )}
          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
          >
              <View style={styles.modalView}>
                  <FlatList
                      data={savedTitles}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                          <TouchableOpacity onPress={() => loadSelectedTitle(item)}>
                              <Text style={styles.modalText}>{item}</Text>
                          </TouchableOpacity>
                      )}
                  />
                  <Button title="Close" onPress={() => setModalVisible(false)} />
              </View>
          </Modal>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
      padding: 10,
      backgroundColor: '#fff',
      flexGrow: 1,
  },
  titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
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
  gpaInput: {
      borderWidth: 1,
      borderColor: '#000',
      padding: 10,
      textAlign: 'center',
      backgroundColor: '#fff',
      flex: 1, // Adjust flex to take available space
  },
  gpaBox: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#e0e0e0',
      borderRadius: 5,
      alignItems: 'center',
  },
  gpaText: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
  },
  menuIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
},
  modalView: {
      marginTop: 50,
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
  },
  modalText: {
      fontSize: 18,
      marginVertical: 10,
  },
});

export default Gpa_calc;