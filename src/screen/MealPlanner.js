import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { db } from '../../db/db_config';
import { Picker } from '@react-native-picker/picker';

const MealPlanner = () => {
  const [mealType, setMealType] = useState('');
  const [mealName, setMealName] = useState('');
  const [price, setPrice] = useState('');
  const [meals, setMeals] = useState([]);
  const [currentMeals, setCurrentMeals] = useState({
    breakfast: {},
    lunch: {},
    dinner: {},
  });
  const [mealsGenerated, setMealsGenerated] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const mealQuery = query(collection(db, 'meals'));
      const querySnapshot = await getDocs(mealQuery);
      const fetchedMeals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMeals(fetchedMeals);
    } catch (error) {
      console.error('Error fetching meals:', error);
      Alert.alert('Error', 'Failed to fetch meals.');
    }
  };

  const addMeal = async () => {
    if (mealType && mealName && price) {
      try {
        const newMeal = { mealType, mealName, price: parseFloat(price) };
        await addDoc(collection(db, 'meals'), newMeal);
        setMeals([...meals, newMeal]);
        setMealType('');
        setMealName('');
        setPrice('');
      } catch (error) {
        console.error('Error adding meal:', error);
        Alert.alert('Error', 'Failed to add meal.');
      }
    } else {
      Alert.alert('Error', 'Please fill all the fields');
    }
  };

  const generateMeals = () => {
    setCurrentMeals({
      breakfast: meals.find(meal => meal.mealType === 'breakfast') || {},
      lunch: meals.find(meal => meal.mealType === 'lunch') || {},
      dinner: meals.find(meal => meal.mealType === 'dinner') || {},
    });
    setMealsGenerated(true);
  };

  const switchMeals = () => {
    const nextMeals = {
      breakfast: getNextMeal('breakfast'),
      lunch: getNextMeal('lunch'),
      dinner: getNextMeal('dinner'),
    };
    setCurrentMeals(nextMeals);
  };

  const getNextMeal = (mealType) => {
    const mealOptions = meals.filter(meal => meal.mealType === mealType);
    const currentMealIndex = mealOptions.findIndex(meal => meal.mealName === currentMeals[mealType]?.mealName);
    const nextMealIndex = (currentMealIndex + 1) % mealOptions.length;
    return mealOptions[nextMealIndex] || {};
  };

  return (
    <View style={styles.container}>
      {/*<Text style={styles.title}>Add a New Meal</Text>
      <Picker
        selectedValue={mealType}
        onValueChange={(itemValue) => setMealType(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Meal Type" value="" />
        <Picker.Item label="Breakfast" value="breakfast" />
        <Picker.Item label="Lunch" value="lunch" />
        <Picker.Item label="Dinner" value="dinner" />
      </Picker>
      <TextInput
        placeholder="Meal Name"
        value={mealName}
        onChangeText={setMealName}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={addMeal} style={styles.button}>
        <Text style={styles.buttonText}>Add Meal</Text>
      </TouchableOpacity>*/}
      <Text style={styles.subtitle}>Don't know what to eat today? Don't worry, I got you!</Text>
      <TouchableOpacity onPress={generateMeals} style={styles.button}>
        <Text style={styles.buttonText}>Generate Meal Plan</Text>
      </TouchableOpacity>

      {mealsGenerated && (
        <>
        <Text style={styles.subtitle}>How about this for your breakfast,lunch and dinner today ?  click the switch button to see other options</Text>
        <Text style={{fontSize:18, fontWeight:'bold'}}>BREAKFAST</Text>
          <View style={styles.mealContainer}>
            <Text style={{fontSize:18, fontWeight:'bold'}}>{currentMeals.breakfast.mealName || 'No meal available'} - #{currentMeals.breakfast.price || 'N/A'}</Text>
          </View>
          <Text style={{fontSize:18, fontWeight:'bold'}}>LUNCH</Text>
          <View style={styles.mealContainer}>
            <Text style={{fontSize:18, fontWeight:'bold'}}>{currentMeals.lunch.mealName || 'No meal available'} - #{currentMeals.lunch.price || 'N/A'}</Text>
          </View>
          <Text style={{fontSize:18, fontWeight:'bold'}}>DINNER</Text>
          <View style={styles.mealContainer}>
            <Text style={{fontSize:18, fontWeight:'bold'}}>{currentMeals.dinner.mealName || 'No meal available'} - #{currentMeals.dinner.price || 'N/A'}</Text>
          </View>
          <TouchableOpacity onPress={switchMeals} style={styles.switchButton}>
            <Text style={styles.buttonText}>Switch Meals</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flex: 1,
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
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle2: {
    marginTop:20,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  mealContainer: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default MealPlanner;
