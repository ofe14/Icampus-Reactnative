import { View, Text, TouchableOpacity,Image } from 'react-native'

import styles from './nearbyjobcard.style'
import { icons } from '../../../../constants'
import Calendar from '../../../../src/screen/Calendar';
import { useNavigation } from "@react-navigation/native";

const Academic_calendar = ({ job, handleNavigate}) => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity 
    style={styles.container}
    onPress={()=> navigation.navigate(Calendar)}
    >
      <TouchableOpacity style={styles.logoContainer}>
        <Image
        source={icons.calendar}
        resizeMode='contain'
        style={styles.logoImage}
        />
      </TouchableOpacity>
      

      <View style={styles.textContainer}>
        <Text style={styles.jobName}>
          Academic_calendar
        </Text>
        <Text style={styles.jobType}>Covennant university's academic calendar</Text>
      </View>
    </TouchableOpacity>
  )
}

export default Academic_calendar   