import { View, Text, TouchableOpacity,Image } from 'react-native'

import styles from './nearbyjobcard.style'
import { icons } from '../../../../constants'

const NearbyJobCard = ({ job, handleNavigate}) => {
  return (
    <TouchableOpacity 
    style={styles.container}
    onPress={() =>handleNavigate}
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
          ofe
        </Text>
        <Text style={styles.jobType}>ofe 2</Text>
      </View>
    </TouchableOpacity>
  )
}

export default NearbyJobCard   