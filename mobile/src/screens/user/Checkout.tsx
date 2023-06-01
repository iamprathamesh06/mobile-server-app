import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import BasicProductList from "../../components/BasicProductList/BasicProductList";
import { colors, network } from "../../constants";
import CustomButton from "../../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomInput from "../../components/CustomInput";
import ProgressDialog from "react-native-progress-dialog";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import axios from "axios";

const PAYMENT_URL = `${network.serverip}/stripe/payment-intent`;
const VERIFY_URL = `${network.serverip}/stripe/verify-payment`;

function notifyMessage(msg: string) {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert(msg);
  }
}

const CheckoutScreen = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const { cartProducts, setCartProducts } = useCart();
  const { user } = useAuth();
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const stripe = useStripe();

  console.log(user);
  const handlePayNow = async () => {
    setProcessingPayment(true);
    let productData = cartProducts.map((product) => {
      return {
        product_id: product._id,
        quantity: product.quantity,
      };
    });

    let orderData = {
      productData,
      user_id: user.user_dbid,
      email: user.email,
      phone: user.phone,
      address: address,
    };

    try {
      const response = await axios.post(PAYMENT_URL, {
        orderData,
      });
      const data = response.data;
      const { client_secret, id } = data.clientSecret;
      const clientSecret = client_secret;
      // console.log(clientSecret);
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Chakii - Fresh Flour Aata Delievery",
      });
      if (initSheet.error) {
        console.error(initSheet.error);
        setProcessingPayment(false);
        console.log(initSheet.error.message);
        // return Alert.alert(initSheet.error.message);
      }

      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret: clientSecret,
      });

      if (presentSheet.error) {
        console.error(presentSheet.error);
        setProcessingPayment(false);
        console.log(presentSheet.error.message);
        // return Alert.alert(presentSheet.error.message);
      }

      // Payment Validation Started Here
      // console.log(id);

      const verifyPayment = await axios.post(VERIFY_URL, { id });
      const status = verifyPayment.data;
      if (status != "failed") {
        AsyncStorage.removeItem("cartProducts");
        setCartProducts([]);
        navigation.replace("OrderConfirm", status);
      } else {
        notifyMessage("Transaction Failed");
      }
    } catch (err) {}
    setProcessingPayment(false);
  };

  const handleCheckout = () => {
    handlePayNow();
  };

  // set the address and total cost on initital render
  useEffect(() => {
    if (streetAddress && city && country != "") {
      setAddress(`${streetAddress}, ${city},${country}, - ${zipcode}`);
    } else {
      setAddress("");
    }
    setTotalCost(
      cartProducts.reduce((accumulator, object) => {
        return accumulator + object.price * object.quantity;
      }, 0)
    );
  }, []);

  return (
    <StripeProvider publishableKey="pk_test_51Mre3gSIea4qb8ub3qmLvyThFfe6qT53FzvR8rIhtG6CHDlOfQcnvb8mLhODpxDXosGtGEi6dNhEgjKTyJd8TRRn00CyV4LiO8">
      <View style={styles.container}>
        <StatusBar></StatusBar>
        <ProgressDialog visible={isloading} label={"Placing Order..."} />
        <View style={styles.topBarContainer}>
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
          <View></View>
          <View></View>
        </View>
        <ScrollView style={styles.bodyContainer} nestedScrollEnabled={true}>
          <Text style={styles.primaryText}>Order Summary</Text>
          <ScrollView
            style={styles.orderSummaryContainer}
            nestedScrollEnabled={true}
          >
            {cartProducts.map((product, index) => (
              <BasicProductList
                key={index}
                image={product.imgUrl}
                title={product.name}
                price={product.price}
                quantity={product.quantity}
              />
            ))}
          </ScrollView>
          <Text style={styles.primaryText}>Total</Text>
          <View style={styles.totalOrderInfoContainer}>
            <View style={styles.list}>
              <Text>Order</Text>
              <Text>{totalCost} ₹</Text>
            </View>
            {/* <View style={styles.list}>
            <Text>Delivery</Text>
            <Text>{deliveryCost} ₹</Text>
          </View> */}
            <View style={styles.list}>
              <Text style={styles.primaryTextSm}>Total</Text>
              <Text style={styles.secondaryTextSm}>
                {totalCost + deliveryCost} ₹
              </Text>
            </View>
          </View>
          <Text style={styles.primaryText}>Contact</Text>
          <View style={styles.listContainer}>
            <View style={styles.list}>
              <Text style={styles.secondaryTextSm}>Email</Text>
              <Text style={styles.secondaryTextSm}>
                {`${user.email.substring(0, 20)}..`}
              </Text>
            </View>
            <View style={styles.list}>
              <Text style={styles.secondaryTextSm}>Phone</Text>
              <Text style={styles.secondaryTextSm}>
                {user ? user.phone : "+916559665442"}
              </Text>
            </View>
          </View>
          <Text style={styles.primaryText}>Address</Text>
          <View style={styles.listContainer}>
            <TouchableOpacity
              style={styles.list}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.secondaryTextSm}>Address</Text>
              <View>
                {country || city || streetAddress != "" ? (
                  <Text
                    style={styles.secondaryTextSm}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {address.length < 25
                      ? `${address}`
                      : `${address.substring(0, 25)}...`}
                  </Text>
                ) : (
                  <Text style={styles.primaryTextSm}>Add</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.primaryText}>Payment</Text>
          <View style={styles.listContainer}>
            <View style={styles.list}>
              <Text style={styles.secondaryTextSm}>Method</Text>
              <Text style={styles.primaryTextSm}>Online</Text>
            </View>
          </View>

          <View style={styles.emptyView}></View>
        </ScrollView>
        <View style={styles.buttomContainer}>
          {country && city && streetAddress != "" ? (
            <CustomButton
              text={!processingPayment ? "Submit Order" : "Processing..."}
              // onPress={() => navigation.replace("orderconfirm")}
              onPress={() => {
                handleCheckout();
              }}
            />
          ) : (
            <CustomButton text={"Submit Order"} disabled />
          )}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modelBody}>
            <View style={styles.modelAddressContainer}>
              <CustomInput
                value={streetAddress}
                setValue={setStreetAddress}
                placeholder={"Enter Street Address"}
              />
              <CustomInput
                value={city}
                setValue={setCity}
                placeholder={"Enter City"}
              />
              <CustomInput
                value={country}
                setValue={setCountry}
                placeholder={"Enter Country"}
              />
              <CustomInput
                value={zipcode}
                setValue={setZipcode}
                placeholder={"Enter ZipCode"}
                keyboardType={"number-pad"}
                maxLength={6}
              />
              {streetAddress || city || country != "" ? (
                <CustomButton
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setAddress(
                      `${streetAddress}, ${city},${country}, - ${zipcode}`
                    );
                  }}
                  text={"save"}
                />
              ) : (
                <CustomButton
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                  text={"close"}
                />
              )}
            </View>
          </View>
        </Modal>
      </View>
    </StripeProvider>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    flex: 1,
  },
  topBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  toBarText: {
    fontSize: 15,
    fontWeight: "600",
  },
  bodyContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  orderSummaryContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    maxHeight: 220,
  },
  totalOrderInfoContainer: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.white,
  },
  primaryText: {
    marginBottom: 5,
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: colors.white,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
    padding: 10,
  },
  primaryTextSm: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.primary,
  },
  secondaryTextSm: {
    fontSize: 15,
    fontWeight: "bold",
  },
  listContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
  },
  buttomContainer: {
    width: "100%",
    padding: 20,
    paddingLeft: 30,
    paddingRight: 30,
  },
  emptyView: {
    width: "100%",
    height: 20,
  },
  modelBody: {
    flex: 1,
    display: "flex",
    flexL: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  modelAddressContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: 320,
    height: 400,
    backgroundColor: colors.white,
    borderRadius: 20,
    elevation: 3,
  },
});
