import {ScrollView,ImageBackground,Image, StyleSheet,Text,TextInput,View,TouchableOpacity, FlatList, Alert, Button } from "react-native";
import { icons,COLORS} from '../../../../constants'
import { useNavigation } from "@react-navigation/native";
import Set_milestones from '../../../../src/screen/Set_milestones'
import styles from './nearbyjobcard.style'


const Set_goals = () => {
  const navigation = useNavigation()
  return (

    <TouchableOpacity  style={styles.container}
    onPress={()=> navigation.navigate(Set_milestones)}
    >
      <TouchableOpacity style={styles.logoContainer}>
        <Image
        source={icons.goal}
        resizeMode='contain'
        style={styles.logoImage}
        />
      </TouchableOpacity>
      

      <View style={styles.textContainer}>
        <Text style={styles.jobName}>
          Set Goals
        </Text>
        <Text style={styles.jobType}> Set your goals and achieve them</Text>
      </View>
    </TouchableOpacity>
  )
}


export default Set_goals   