import { StyleSheet,View,Text,Image } from "react-native";
import React from "react";

const Fallback=() =>{
    return(
        <View style={{
            alignItems:"center"
        }}>
            <Image source ={require("../../assets/icons/schedule.png")} 
            style ={{
                height:300,
                width:300,
            }} />
            <Text>Start adding your task</Text>
        </View>
    )
}

export default Fallback