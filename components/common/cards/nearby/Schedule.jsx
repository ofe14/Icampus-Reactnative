import { View, Text, TouchableOpacity,Image } from 'react-native'

import styles from './nearbyjobcard.style'
import { icons } from '../../../../constants'
import { useNavigation } from "@react-navigation/native";
import Todo_screen from '../../../../src/screen/Todo_screen';


const Schedule = () => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity  style={styles.container}
    onPress={()=> navigation.navigate(Todo_screen)}
    >
      <TouchableOpacity style={styles.logoContainer}>
        <Image
        source={icons.schedule}
        resizeMode='contain'
        style={styles.logoImage}
        />
      </TouchableOpacity>
      

      <View style={styles.textContainer}>
        <Text style={styles.jobName}>
          Student Schedule
        </Text>
        <Text style={styles.jobType}>schedule</Text>
      </View>
    </TouchableOpacity>
  )
}

export default Schedule   