import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { useAuth } from "../../context/AuthContext";
import { gql, useMutation } from "@apollo/client";

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($password: String!) {
    resetPassword(password: $password) {
      msg
    }
  }
`;

const UpdatePassword = ({ navigation, route }) => {
  const { user } = route.params;
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setCconfirmPassword] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [requestLoading, setRequestLoading] = useState(false);
  const [resetPassword, { loading, error: mutationError }] = useMutation(
    RESET_PASSWORD_MUTATION
  );

  // method to update the password by the check the current password
  const updatePasswordHandle = () => {
    if (newPassword === "" || confirmPassword === "") {
      setAlertType("error");
      setError("Please fill  all fields below");
    } else if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
      setRequestLoading(true);
      resetPassword({ variables: { password: newPassword } })
        .then((response) => {
          const { msg } = response.data.resetPassword;
          setRequestLoading(false);
          setAlertType("success");
          setError(msg);
        })
        .catch((error) => {
          setRequestLoading(false);
          setAlertType("error");
          setError(error.message);
          console.log("error", error.message);
        });
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
          <Text style={styles.screenNameText}>Update Password</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>
            Your new password must be different from previous used password
          </Text>
        </View>
      </View>
      <View style={styles.formContainer}>
        <CustomAlert message={error} type={alertType} />

        <CustomInput
          value={newPassword}
          setValue={setNewPassword}
          placeholder={"New Password"}
          secureTextEntry={true}
        />
        <CustomInput
          value={confirmPassword}
          setValue={setCconfirmPassword}
          placeholder={"Confirm New Password"}
          secureTextEntry={true}
        />
      </View>
      <CustomButton
        text={requestLoading ? "Loading..." : "Update Password"}
        onPress={updatePasswordHandle}
        radius={5}
      />
    </View>
  );
};

export default UpdatePassword;

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
