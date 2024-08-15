import {Image,Text,TextInput,View,TouchableOpacity, FlatList, Alert, Button } from "react-native";
import { icons,COLORS} from '../../../../constants'
import Reading_tips from "../../../../src/screen/Reading_tips";
import { useNavigation } from "@react-navigation/native";
import styles from "./nearbyjobcard.style";

const Tips = () => {
  const navigation = useNavigation()
  return (

    
    <TouchableOpacity  style={styles.container}
    onPress={()=> navigation.navigate(Reading_tips)}
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
          Tips
        </Text>
        <Text style={styles.jobType}> Stay informed </Text>
      </View>
    </TouchableOpacity>
  )
}
export default Tips;  
