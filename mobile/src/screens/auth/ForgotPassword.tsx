import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { gql, useMutation } from "@apollo/client";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

const FORGOT_PASSWORD_QUERY = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email) {
      msg
    }
  }
`;

const ForgetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [forgotPassword] = useMutation(FORGOT_PASSWORD_QUERY);

  const sendInstructionsHandle = async () => {
    if (!email.includes("@") || !email.includes(".")) {
      return setError("Email is not valid");
    }
    if (email.length < 6) {
      return setError("Email is too short");
    }

    try {
      const { data } = await forgotPassword({ variables: { email } });
      alert("Reset Password Link Sent Successfully to Your Email Address");
    } catch (err) {
      setError(err?.message);
    }
  };

  return (
    <View style={styles.container}>
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
        <View>
          <Text style={styles.screenNameText}>Reset Password</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>
            Enter the email associated with your account and we'll send an email
            with instruction to reset the password.
          </Text>
        </View>
      </View>
      <View style={styles.formContainer}>
        <CustomAlert message={error} type={"error"} />
        <CustomInput
          value={email}
          setValue={setEmail}
          placeholder={"Enter your Email Address"}
          placeholderTextColor={colors.muted}
          radius={5}
        />
      </View>
      <CustomButton
        text={"Send Instruction"}
        onPress={sendInstructionsHandle}
        radius={5}
      />
    </View>
  );
};

export default ForgetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
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
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 5,
    fontSize: 15,
  },
  formContainer: {
    marginTop: 10,
    marginBottom: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    width: "100%",
    flexDirecion: "row",
  },
});
