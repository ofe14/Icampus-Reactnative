
import {Image,Text,TextInput,View,TouchableOpacity, FlatList, Alert, Button } from "react-native";
import { icons,COLORS} from '../../../../constants'
import { useNavigation } from "@react-navigation/native";
import Timetable from "../../../../src/screen/Timetable";
import styles from "./nearbyjobcard.style";


const Reading_timetable = () => {
  const navigation = useNavigation()
  return (

    <TouchableOpacity  style={styles.container}
    onPress={()=> navigation.navigate(Timetable)}
    >
      <TouchableOpacity style={styles.logoContainer}>
        <Image
        source={icons.book}
        resizeMode='contain'
        style={styles.logoImage}
        />
      </TouchableOpacity>
      

      <View style={styles.textContainer}>
        <Text style={styles.jobName}>
          Study Timetable
        </Text>
        <Text style={styles.jobType}>Be more prepared than everyone else</Text>
      </View>
    </TouchableOpacity>
  )
}


export default Reading_timetable;  