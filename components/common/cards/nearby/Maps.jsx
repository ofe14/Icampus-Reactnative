import { View, Text, TouchableOpacity,Image } from 'react-native'

import styles from './nearbyjobcard.style'
import { icons } from '../../../../constants'
import { useNavigation } from "@react-navigation/native";
import Map_screen from '../../../../src/screen/Map_screen'

const Maps = ({handleNavigate}) => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity 
    style={styles.container}
    onPress={()=> navigation.navigate(Map_screen)}
    >
      <TouchableOpacity style={styles.logoContainer}>
        <Image
        source={icons.map}
        resizeMode='contain'
        style={styles.logoImage}
        />
      </TouchableOpacity>
      

      <View style={styles.textContainer}>
        <Text style={styles.jobName}>
          Map
        </Text>
        <Text style={styles.jobType}>where to</Text>
      </View>
    </TouchableOpacity>
  )
}

export default Maps
