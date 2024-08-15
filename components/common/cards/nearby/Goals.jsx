import { View, Text, TouchableOpacity,Image } from 'react-native'

import styles from './nearbyjobcard.style'
import { icons } from '../../../../constants'
import { useNavigation } from "@react-navigation/native";

const Goals = () => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity  style={styles.container}
    onPress={()=> navigation.navigate(Goals_milestones)}
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
          Goals/Milestones
        </Text>
        <Text style={styles.jobType}> Set your goals and achieve them</Text>
      </View>
    </TouchableOpacity>
  )
}

export default Goals   