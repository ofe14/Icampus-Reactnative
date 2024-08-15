import {ImageBackground,ScrollView, StyleSheet,Text,TextInput,View,TouchableOpacity, FlatList, Alert, Button } from "react-native";
import React, { useState,useEffect} from "react";
import { IconButton } from "react-native-paper";
import { COLORS, icons } from '../../constants'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { NavigationContainer } from "@react-navigation/native";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";


const Reading_tips = () => {
  return (
<View style={styles.container}>
  <ScrollView>
  <View style={{height:180}}>
      <TouchableOpacity
        style={styles.databox}>
        <ImageBackground
          source={icons.prioritize}
          style={{
            height: 150,
            width: 150,
            opacity: 0.6,
            position: 'absolute',
          }}
        />
        <View style={styles.overlay} />
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.texts}>Get Organised</Text>
          <Text style={styles.texts_tips}>Taking the time to get organised will set you up well and help you achieve your learning goals.</Text>

        </View>
      </TouchableOpacity>
</View>
<View style={{height:180}}>
      <TouchableOpacity
        style={styles.databox}>
        <ImageBackground
          source={icons.chalkboard}
          style={{
            height: 150,
            width: 150,
            opacity: 0.6,
            position: 'absolute',
          }}
        />
        <View style={styles.overlay} />
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.texts}>Don't skip class</Text>
          <Text style={styles.texts_tips}>Skipping class can be detrimental to your learning and achieving your study goals. It leaves gaping holes in your notes and in your subject knowledge.</Text>

        </View>
      </TouchableOpacity>
</View>
<View style={{height:180}}>
      <TouchableOpacity
        style={styles.databox}>
        <ImageBackground
          source={icons.note}
          style={{
            height: 150,
            width: 150,
            opacity: 0.6,
            position: 'absolute',
          }}
        />
        <View style={styles.overlay} />
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.texts}>Take Notes</Text>
          <Text style={styles.texts_tips}>To keep your brain engaged during class, take notes, which you can refer to later, as you refine your study techniques.Notes can help store information in your long-term memory, right there in class.</Text>

        </View>
      </TouchableOpacity>
</View>
<View style={{height:180}}>
      <TouchableOpacity
        style={styles.databox}>
        <ImageBackground
          source={icons.note}
          style={{
            height: 150,
            width: 150,
            opacity: 0.6,
            position: 'absolute',
          }}
        />
        <View style={styles.overlay} />
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.texts}>Take Notes</Text>
          <Text style={styles.texts_tips}>To keep your brain engaged during class, take notes, which you can refer to later, as you refine your study techniques.Notes can help store information in your long-term memory, right there in class.</Text>

        </View>
      </TouchableOpacity>
</View>
<View style={{height:180}}>
      <TouchableOpacity
        style={styles.databox}>
        <ImageBackground
          source={icons.note}
          style={{
            height: 150,
            width: 150,
            opacity: 0.6,
            position: 'absolute',
          }}
        />
        <View style={styles.overlay} />
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.texts}>Create a study plan and stick to it</Text>
          <Text style={styles.texts_tips}>One top study tip is to create a schedule or plan.This is incredibly helpful for time management and can help you reach your learning goals.</Text>

        </View>
      </TouchableOpacity>
</View>
<View style={{height:180}}>
      <TouchableOpacity
        style={styles.databox}>
        <ImageBackground
          source={icons.chalkboard}
          style={{
            height: 150,
            width: 150,
            opacity: 0.6,
            position: 'absolute',
          }}
        />
        <View style={styles.overlay} />
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.texts}>Don't skip class</Text>
          <Text style={styles.texts_tips}>Skipping class can be detrimental to your learning and achieving your study goals. It leaves gaping holes in your notes and in your subject knowledge.</Text>

        </View>
      </TouchableOpacity>
</View>
<View style={{height:180}}>
      <TouchableOpacity
        style={styles.databox}>
        <ImageBackground
          source={icons.prioritize}
          style={{
            height: 150,
            width: 150,
            opacity: 0.6,
            position: 'absolute',
          }}
        />
        <View style={styles.overlay} />
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.texts}>Get Organised</Text>
          <Text style={styles.texts_tips}>Taking the time to get organised will set you up well and help you achieve your learning goals.</Text>

        </View>
      </TouchableOpacity>
</View>
  </ScrollView>
    </View>
    
    
  );
};

const styles = StyleSheet.create({

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(128, 0, 128, 0.6)', // Semi-transparent purple
    borderRadius: 6,
  },

  databox :{
      height: 170,
      margin:10,
      borderColor : '#C7CBCF',
      borderWidth : 1,
      borderRadius:12,
      justifyContent: "center",
      alignItems : "center",
      padding: 10,
      borderRadius: 6,
      
  },
  container: {
      flex: 1,
      marginHorizontal:10,
  },

  selectedWeekday: {
      backgroundColor: COLORS.covenant,
  },
  texts:
  {
    color: '#fff',
    fontSize:25,
    fontWeight:"800",
  },
  texts_tips:
  {
    color: '#fff',
    fontSize:15,
    fontWeight:"800",
  }
});


export default Reading_tips;