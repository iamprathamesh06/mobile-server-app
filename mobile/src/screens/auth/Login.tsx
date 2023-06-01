import {
  StyleSheet,
  Image,
  Text,
  View,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import React, { useState, useEffect } from "react";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import header_logo from "../../assets/logo/logo.png";
import CustomButton from "../../components/CustomButton";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import ProgressDialog from "react-native-progress-dialog";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { gql } from "@apollo/client";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { client } from "../../client/ApolloClient";

const ME_QUERY = gql`
  query {
    me {
      name
      email
      emailVerified
      phone
      role
      user_dbid
    }
  }
`;

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isloading, setIsloading] = useState(false);
  const { setIsAuthenticated, setUser, user } = useAuth();

  const storeToken = async (token) => {
    try {
      console.log(token);
      AsyncStorage.setItem("token", token);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const getUserData = async () => {
    return await client.query({ query: ME_QUERY });
  };

  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const { error, data, loading } = await client.query({
  //         query: ME_QUERY,
  //       });
  //       console.log(error);
  //       console.log(data);
  //     } catch (err) {
  //       console.log(JSON.stringify(err));
  //     }
  //   };
  //   getUser();
  // }, []);

  const loginHandle = async () => {
    if (email == "") {
      return setError("Please enter your email");
    }
    if (password == "") {
      return setError("Please enter your password");
    }
    if (!email.includes("@")) {
      return setError("Email is not valid");
    }
    // length of email must be greater than 5 characters
    if (email.length < 6) {
      return setError("Email is too short");
    }
    // length of password must be greater than 5 characters
    if (password.length < 6) {
      return setError("Password must be 6 characters long");
    }
    //[check validation] -- End
    setIsloading(true);
    let result = null;

    try {
      result = await signInWithEmailAndPassword(auth, email, password);
      // console.log(result);
      const token = result.user.accessToken;
      console.log(token);
      storeToken(token);
      let userData = await getUserData();
      console.log(userData);
      if (userData) {
        setUser(userData.data.me);
      }
    } catch (err) {
      setError(err.message);
    }

    setIsloading(false);
  };

  useEffect(() => {
    if (user != null) {
      setIsAuthenticated(true);
    }
  }, [user]);

  return (
    <InternetConnectionAlert onChange={(connectionState) => {}}>
      <KeyboardAvoidingView
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView style={{ flex: 1, width: "100%" }}>
          <ProgressDialog visible={isloading} label={"Login ..."} />
          <StatusBar></StatusBar>
          <View style={styles.welconeContainer}>
            <View>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.welcomeParagraph}>
                Fresh Flour at Your Doorstep
              </Text>
            </View>
            {/* <View>
              <Image style={styles.logo} source={header_logo} />
            </View> */}
          </View>
          <View style={styles.screenNameContainer}>
            <Text style={styles.screenNameText}>Login</Text>
          </View>
          <View style={styles.formContainer}>
            <CustomAlert message={error} type={"error"} />
            <CustomInput
              value={email}
              setValue={setEmail}
              placeholder={"Username"}
              placeholderTextColor={colors.muted}
              radius={5}
            />
            <CustomInput
              value={password}
              setValue={setPassword}
              secureTextEntry={true}
              placeholder={"Password"}
              placeholderTextColor={colors.muted}
              radius={5}
            />
            <View style={styles.forgetPasswordContainer}>
              <Text
                onPress={() => navigation.navigate("ForgotPassword")}
                style={styles.ForgetText}
              >
                Forget Password?
              </Text>
              <Text></Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttomContainer}>
          <CustomButton text={"Login"} onPress={loginHandle} />
        </View>
        <View style={styles.bottomContainer}>
          <Text>Don't have an account?</Text>
          <Text
            onPress={() => navigation.navigate("Register")}
            style={styles.signupText}
          >
            signup
          </Text>
        </View>
      </KeyboardAvoidingView>
    </InternetConnectionAlert>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  welconeContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "20%",
    // padding:15
  },
  formContainer: {
    flex: 3,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    width: "100%",
    flexDirecion: "row",
    padding: 5,
  },
  logo: {
    resizeMode: "contain",
    width: 80,
  },
  welcomeText: {
    fontSize: 42,
    fontWeight: "bold",
    color: colors.muted,
  },
  welcomeParagraph: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.primary_shadow,
  },
  forgetPasswordContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  ForgetText: {
    fontSize: 15,
    fontWeight: "600",
  },
  buttomContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  bottomContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    marginLeft: 2,
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
});
