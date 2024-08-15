import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";

import styles from "./nearbyjobs.style";
import { COLORS, SIZES } from "../../../constants";
import Nearbyjobcard from "../../common/cards/nearby/NearbyJobCard";
import Academic_calender from "../../common/cards/nearby/Academic_calender";
import Maps from "../../common/cards/nearby/Maps";
import Schedule from "../../common/cards/nearby/Schedule";


const Nearbyjobs = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Features</Text>
      </View>

      <View style={styles.cardsContainer}>
            <Maps/>
            <Link href="/calendar"><Academic_calender/></Link>
            <Link href="/Grade_tracker"><Grade_tracker/></Link>
            <Link href="/Schedule"><Schedule/></Link>
      </View>
    </View>
  );
};

export default Nearbyjobs;