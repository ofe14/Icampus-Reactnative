import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { IconButton } from "react-native-paper";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where ,getDoc, onSnapshot } from "firebase/firestore";
import { db } from '../../src/config/firestore';
import { COLORS, SIZES, FONT } from '../../constants';
import { auth } from '../../db/db_config';
import { format } from 'date-fns';
import NewtonCradleLoader from "./loader";

const Todo_screen = () => {
  const [username, setUsername] = useState('');
  const [selectedWeekday, setSelectedWeekday] = useState(null);
  const [todo, setTodo] = useState('');
  const [todolist, setTodolist] = useState([]);
  const [taskTime, setTaskTime] = useState(null);
  const [editedTodo, setEditedTodo] = useState(null);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [weekdays, setWeekdays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentDate = new Date();
    const currentDayIndex = currentDate.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6
    const weekdaysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shiftedWeekdays = [...weekdaysArray.slice(currentDayIndex), ...weekdaysArray.slice(0, currentDayIndex)];
    setWeekdays(shiftedWeekdays);
  }, []);

  useEffect(() => {
    if (selectedWeekday) {
      fetchTodos();
    }
  }, [selectedWeekday]);

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

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, "Tasks"), where("day", "==", selectedWeekday), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const tasks = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            task: data.task,
            day: data.day,
            time: data.time ? data.time.toDate() : null
          };
        });
        setTodolist(tasks);
      }
    } catch (error) {
      console.error("Error fetching todos: ", error);
      setError(error)
    } finally {
      setLoading(false);
    }
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleConfirmTime = (time) => {
    setTaskTime(time);
    hideTimePicker();
  };

  const formatTime = (time) => {
    if (time instanceof Date) {
      const options = { hour: '2-digit', minute: '2-digit' };
      let d = new Date(time);
      return d.toLocaleTimeString([], options);
    }
    return time;
  };

  const addTasks = async (todo, taskTime, weekday) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = await addDoc(collection(db, "Tasks"), {
          task: todo,
          time: taskTime,
          day: weekday,
          userId: user.uid
        });
        scheduleNotification(todo, taskTime);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const scheduleNotification = async (task, time) => {
    const schedulingOptions = {
      content: {
        title: "Hey " + username,
        body: "Remember you said " + task,
        sound: 'default',
      },
      trigger: {
        date: time,
      },
    };
    await Notifications.scheduleNotificationAsync(schedulingOptions);
  };

  const addTodo = () => {
    if (todo.trim() !== '' && selectedWeekday) {
      const newTodo = { id: Date.now().toString(), task: todo, weekday: selectedWeekday, time: taskTime ? formatTime(taskTime) : null };
      setTodolist([...todolist, newTodo]);
      setTodo('');
      setTaskTime(null);
      addTasks(todo, taskTime, selectedWeekday);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "Tasks", id));
      const updatedTodolist = todolist.filter((todo) => todo.id !== id);
      setTodolist(updatedTodolist);
    } catch (error) {
      console.error("Error deleting todo: ", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const editTodo = (todo) => {
    setEditedTodo(todo);
    setTodo(todo.task);
    setTaskTime(todo.time);
  };

  const updateTodo = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "Tasks", editedTodo.id), { task: todo, time: taskTime });
      const updatedTodos = todolist.map((item) => {
        if (item.id === editedTodo.id) {
          return { ...item, task: todo, time: taskTime };
        }
        return item;
      });
      setTodolist(updatedTodos);
      setEditedTodo(null);
      setTodo('');
      setTaskTime(null);
      scheduleNotification(todo, taskTime);
    } catch (error) {
      console.error("Error updating todo: ", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const RenderTodos = ({ item }) => {
    return (
      <View style={styles.todoItem}>
        <Text style={styles.todoText}>{item.task}</Text>
        <Text style={styles.todoText}>{item.time ? `${formatTime(item.time)}` : 'No time set'}</Text>
        <IconButton icon="pencil" color="#fff" onPress={() => editTodo(item)} />
        <IconButton icon="delete" color="#fff" onPress={() => deleteTodo(item.id)} />
      </View>
    );
  };

  const Fallback = () => {
    return <Text style={styles.fallbackText}>No tasks for this day.</Text>;
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 180 }}>
        <ScrollView style={styles.scrollview} horizontal showsVerticalScrollIndicator={false}>
          {weekdays.map((weekday) => (
            <TouchableOpacity
              key={weekday}
              style={[styles.databox, selectedWeekday === weekday && styles.selectedWeekday]}
              onPress={() => setSelectedWeekday(weekday)}
            >
              <Text style={[styles.weekdayText, selectedWeekday === weekday && styles.selectedWeekdayText]}>{weekday}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <TextInput
        style={{
          borderWidth: 2,
          borderColor: COLORS.covenant,
          borderRadius: 6,
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
        placeholder="Input your Task"
        value={todo}
        onChangeText={setTodo}
      />
      <TouchableOpacity style={styles.button} onPress={showTimePicker}>
        <Text style={styles.buttonText}>{taskTime ? `Time: ${taskTime.toLocaleTimeString()}` : 'Set Time'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={editedTodo ? updateTodo : addTodo}>
        <Text style={styles.buttonText}>{editedTodo ? 'Save' : 'Add'}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={hideTimePicker}
      />

      <FlatList
        style={styles.list}
        data={todolist}
        renderItem={RenderTodos}
        ListEmptyComponent={Fallback}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  databox: {
    height: 130,
    width: 120,
    borderColor: '#C7CBCF',
    borderWidth: 1,
    margin: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  scrollview: {
    height: 1,
    marginTop: 30,
  },
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  selectedWeekday: {
    backgroundColor: COLORS.covenant,
  },
  weekdayText: {
    color: COLORS.covenant,
    fontWeight: 'bold',
  },
  selectedWeekdayText: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 6,
    paddingVertical: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  list: {
    marginTop: 20,
  },
  todoItem: {
    backgroundColor: COLORS.covenant,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  todoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: "800",
    flex: 1,
  },
  fallbackText: {
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    marginTop: 20,
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

export default Todo_screen;
