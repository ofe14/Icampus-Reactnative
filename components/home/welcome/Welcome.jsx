import {useState} from 'react'
import { View, Text,TextInput,TouchableOpacity,Image,FlatList } from 'react-native'
import { useRouter } from 'expo-router'

import styles from './welcome.style'
import{icons,SIZES} from "../../../constants"

/*const jobTypes= ["Map","Planner","Time table","Grades","news",]*/

const Welcome = () => {
  const router = useRouter();
  const [activeJobType, setActiveJobType]=useState("part time")
  return (
    
    <View>
      <View style={styles.container}>

        <View style = {styles.box1}>
          <View style={styles.inner}>
          <Text style={styles.userName}>Hello!</Text> 
          <Text style={styles.welcomeMessage}>How are you doing today</Text>
          </View>
        </View>
        
        {/*<View style = {styles.box2}>
          <View style={styles.inner}>
          <Image
            source={icons.smile}
            resizeMode='contain'
            style={styles.welcome_image}
          />
          </View>
  </View>*/}
        
      </View>
      

      <View style={styles.tabsContainer}>
        {/*<FlatList
        data={jobTypes}
        renderItem={({item})=> (
          <TouchableOpacity
          style={styles.tab(activeJobType, item)}
          onPress={()=> {
            setActiveJobType(item);
            router.push('/search/${item}')
          }}
          >
            
            <Text style={styles.tabText(activeJobType, item)}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
        contentContainerStyle={{columnGap:SIZES.small}}
        horizontal
        />*/}

      </View>
    </View>
    
  )
}

export default Welcome