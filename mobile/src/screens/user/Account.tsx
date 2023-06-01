import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import UserProfileCard from "../../components/UserProfileCard/UserProfileCard";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import OptionList from "../../components/OptionList/OptionList";
import { network } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";

const MyAccountScreen = ({ navigation, route }) => {
  const { setUser, setIsAuthenticated } = useAuth();
  const [showBox, setShowBox] = useState(true);
  const [error, setError] = useState("");
  const { user } = route.params;
  const userID = user["_id"];

  //method for alert
  const showConfirmDialog = (id) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove your account?",
      [
        {
          text: "Yes",
          onPress: () => {
            setShowBox(false);
            DeleteAccontHandle(id);
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  //method to delete the account using API call
  const DeleteAccontHandle = (userID) => {
    let fetchURL = network.serverip + "/delete-user?id=" + String(userID);
    console.log(fetchURL);
    fetch(fetchURL, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success == true) {
          console.log(result.data);
          navigation.navigate("login");
        } else {
          setError(result.message);
        }
      })
      .catch((error) => console.log("error", error));
  };
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto"></StatusBar>
      <View style={styles.TopBarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>My Account</Text>
      </View>
      <View style={styles.UserProfileCardContianer}>
        <UserProfileCard
          Icon={Ionicons}
          name={user["name"]}
          email={user["email"]}
        />
      </View>
      <View style={styles.OptionsContainer}>
        <OptionList
          text={"Change Password"}
          Icon={Ionicons}
          iconName={"key-sharp"}
          onPress={
            () =>
              navigation.navigate("UpdatePassword", {
                user: user,
              }) // navigate to updatepassword
          }
        />
        <OptionList
          text={"Delete My Account"}
          Icon={MaterialIcons}
          iconName={"delete"}
          type={"danger"}
          onPress={async () => {
            Alert.alert(
              "Confirm Delete Your Account",
              "Are you sure do you want to delete your account.",
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
};

export default MyAccountScreen;

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
