import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import UserProfileCard from "../../components/UserProfileCard";
import OptionList from "../../components/OptionList";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile({ navigation }) {
  const [userInfo, setUserInfo] = useState({});
  const { user, setIsAuthenticated, setUser } = useAuth();

  const convertToJSON = (obj) => {
    try {
      setUserInfo(JSON.parse(obj));
    } catch (e) {
      setUserInfo(obj);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    setUserInfo(user);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto"></StatusBar>
      <View style={styles.TopBarContainer}>
        <TouchableOpacity>
          <Ionicons name="menu-sharp" size={30} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>Profile</Text>
      </View>
      <View style={styles.UserProfileCardContianer}>
        <UserProfileCard Icon={Ionicons} name={userInfo?.name} />
      </View>
      <View style={styles.OptionsContainer}>
        <OptionList
          text={"My Account"}
          Icon={Ionicons}
          iconName={"person"}
          onPress={() => navigation.navigate("MYACCOUNT", { user: userInfo })}
        />

        {/* !For future use --- */}
        {/* <OptionList
        text={"Settings"}
        Icon={Ionicons}
        iconName={"settings-sharp"}
        onPress={() => console.log("working....")}
      />
      <OptionList
        text={"Help Center"}
        Icon={Ionicons}
        iconName={"help-circle"}
        onPress={() => console.log("working....")}
      /> */}
        {/* !For future use ---- End */}
        <OptionList
          text={"Logout"}
          Icon={Ionicons}
          iconName={"log-out"}
          onPress={async () => {
            Alert.alert(
              "Confirm Logout",
              "Are you sure do you want to log out.",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "Confirm", onPress: () => handleLogout() },
              ]
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    flex: 1,
  },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  UserProfileCardContianer: {
    width: "100%",
    height: "25%",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  OptionsContainer: {
    width: "100%",
  },
});
