import { View, Text, TouchableOpacity,Image } from 'react-native'

import styles from './popularjobcard.style'
import { icons } from '../../../../constants'

const PopularJobCard = ({ item, selectedJob, handleCardPress}) => {
  return (
    <TouchableOpacity style={styles.container(selectedJob, item)}
    onPress={() => handleCardPress(item)

      
    }>
      <Text>Upcoming</Text>
      <TouchableOpacity style={styles.logoContainer(selectedJob, item)}>
        <Image
        source={icons.schedule}
        resizeMode='contain'
        style={styles.logoImage}
        />
      </TouchableOpacity>

      <Text style={styles.companyName} numberOfLines={1}>CSC415 TEST 2</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.jobName(selectedJob,item)}>
          MARCH 2ND 2024
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default PopularJobCard