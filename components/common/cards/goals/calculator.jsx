import {Image,Text,TextInput,View,TouchableOpacity, FlatList, Alert, Button } from "react-native";
import { icons,COLORS} from '../../../../constants'
import { useNavigation } from "@react-navigation/native";
import Gpa_calc from "../../../../src/screen/Gpa_calc";
import styles from "./nearbyjobcard.style";


const Calculator = () => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity  style={styles.container}
    onPress={()=> navigation.navigate(Gpa_calc)}
    >
      <TouchableOpacity style={styles.logoContainer}>
        <Image
        source={icons.calculator}
        resizeMode='contain'
        style={styles.logoImage}
        />
      </TouchableOpacity>
      

      <View style={styles.textContainer}>
        <Text style={styles.jobName}>
          Gpa Calculator
        </Text>
        <Text style={styles.jobType}> Stay one step ahead </Text>
      </View>
    </TouchableOpacity>
  
  )
}


export default Calculator;  