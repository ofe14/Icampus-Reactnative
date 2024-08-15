import { View, Text, TouchableOpacity,Image } from 'react-native'

import styles from './nearbyjobcard.style'
import { icons } from '../../../../constants'
import { useNavigation } from "@react-navigation/native";
import MealPlanner from '../../../../src/screen/MealPlanner';


const Meals = () => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity  style={styles.container}
    onPress={()=> navigation.navigate(MealPlanner)}
    >
      <TouchableOpacity style={styles.logoContainer}>
        <Image
        source={icons.serving}
        resizeMode='contain'
        style={styles.logoImage}
        />
      </TouchableOpacity>
      

      <View style={styles.textContainer}>
        <Text style={styles.jobName}>
          Meal planner
        </Text>
        <Text style={styles.jobType}>plan your meals</Text>
      </View>
    </TouchableOpacity>
  )
}

export default Meals  