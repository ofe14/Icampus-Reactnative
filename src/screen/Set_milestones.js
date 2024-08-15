import { Image, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Button, Modal, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS } from '../../constants';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, setDoc } from "firebase/firestore";
import { db, auth } from '../../db/db_config';
import { SIZES, FONT } from "../../constants";
import NewtonCradleLoader from "./loader";

const Set_milestones = () => {
  const [milestones, setMilestones] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [editedGoal, setEditedGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMilestones();
  }, []);
  

  const fetchMilestones = async () => {
    setLoading(true);
    try {
    const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, "Milestones"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const goals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMilestones(goals);
      }
    } catch (error) {
      console.error("Error fetching goals: ", error);
      setError("Check your internet connection");
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async () => {
    setLoading(true);
    if (!newGoal.trim()) {
      Alert.alert("Error", "Please enter a goal.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = await addDoc(collection(db, "Milestones"), {
          goal: newGoal,
          completed: false,
          userId: user.uid
        });
        setMilestones([...milestones, { id: docRef.id, goal: newGoal, completed: false }]);
        setNewGoal('');
      }
    } catch (error) {
      console.error("Error adding goal: ", error);
      setError("Check your internet connection");
    } finally {
      setLoading(false);
    }
  };

  const toggleGoalCompletion = async (id, currentStatus) => {
    try {
      const docRef = doc(db, "Milestones", id);
      await updateDoc(docRef, { completed: !currentStatus });
      setMilestones(milestones.map(milestone =>
        milestone.id === id ? { ...milestone, completed: !currentStatus } : milestone
      ));
    } catch (error) {
      console.error("Error updating goal: ", error);
      setError("Check your internet connection");
    }
  };

  const deleteGoal = async (id) => {
    setLoading(true);
    try {
      const docRef = doc(db, "Milestones", id);
      await deleteDoc(docRef);
      setMilestones(milestones.filter(milestone => milestone.id !== id));
    } catch (error) {
      console.error("Error deleting goal: ", error);
      setError("Check your internet connection");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (goal) => {
    setCurrentGoal(goal);
    setEditedGoal(goal.goal);
    setIsEditModalVisible(true);
  };

  const updateGoal = async () => {
    if (!editedGoal.trim()) {
      Alert.alert("Error", "Please enter a goal.");
      return;
    }

    try {
      const docRef = doc(db, "Milestones", currentGoal.id);
      await updateDoc(docRef, { goal: editedGoal });
      setMilestones(milestones.map(milestone =>
        milestone.id === currentGoal.id ? { ...milestone, goal: editedGoal } : milestone
      ));
      setIsEditModalVisible(false);
      setCurrentGoal(null);
      setEditedGoal('');
    } catch (error) {
      console.error("Error updating goal: ", error);
      setError("Check your internet connection");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Goals & Milestones</Text>
      <FlatList
        data={milestones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalContainer}>
            <TouchableOpacity style={{ width: '100%' }} onPress={() => toggleGoalCompletion(item.id, item.completed)}>
              <Text style={[styles.goalText, item.completed && styles.completedGoal]}>
                {item.goal}
              </Text>
              <View style={styles.goalActions}>
                <TouchableOpacity onPress={() => openEditModal(item)}>
                  <Image source={require('../../assets/icons/pencil.png')} style={styles.menuIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteGoal(item.id)}>
                  <Image source={require('../../assets/icons/delete.png')} style={styles.menuIcon} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter new goal"
        value={newGoal}
        onChangeText={setNewGoal}
      />
      <View style={{ height: 70 , marginTop:20 }}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <NewtonCradleLoader />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <Button title="Add Goal" onPress={addGoal}/>
        )}
      </View>
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Goal</Text>
            <TextInput
              style={styles.input}
              placeholder="Edit goal"
              value={editedGoal}
              onChangeText={setEditedGoal}
            />
            <View style={styles.modalButtons}>
              <Button title="Update" onPress={updateGoal} />
              <Button title="Cancel" onPress={() => setIsEditModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  goalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  goalText: {
    fontSize: 15,
    width: '100%',
  },
  completedGoal: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginLeft: 30,
  },
  goalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
    alignSelf: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
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

export default Set_milestones;
