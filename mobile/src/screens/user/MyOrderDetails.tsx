import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors, network } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import ProgressDialog from "react-native-progress-dialog";
import BasicProductList from "../../components/BasicProductList/BasicProductList";
import StepIndicator from "react-native-step-indicator";
import { gql } from "@apollo/client";
import { client } from "../../client/ApolloClient";
import { getFormattedDate } from "../../utils/getFormattedDate";

const MyOrderDetails = ({ navigation, route }) => {
  const { order_id } = route.params;
  const [orderDetail, setOrderDetail] = useState(null);
  const [productData, setProductData] = useState<[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrderDetail = () => {
    const ORDER_DETAIL = gql`
      query GetOrder($_id: String!) {
        getOrder(_id: $_id) {
          _id
          amount
          user_id
          address
          latitude
          longitude
          transaction_id
          order_status
          payment_status
          createdAt
          contact_info
          product_details {
            product_id
            quantity
          }
        }
      }
    `;
    client
      .query({ query: ORDER_DETAIL, variables: { _id: order_id } })
      .then((response) => {
        // console.log(response.data.getOrder);
        setOrderDetail(response.data.getOrder);
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
      });
  };

  const fetchProductsData = (product_details) => {
    const GET_PRODUCT = gql`
      query GetProduct($_id: String!) {
        getProduct(_id: $_id) {
          _id
          name
          price
          imgUrl
        }
      }
    `;
    let promises = [];
    for (const product of product_details) {
      const promise = client
        .query({
          query: GET_PRODUCT,
          variables: { _id: product.product_id },
        })
        .then((response) => {
          return response.data.getProduct;
        })
        .catch((err) => {
          console.log(err);
          return null;
        });
      promises.push(promise);
    }
    return Promise.all(promises);
  };

  useEffect(() => {
    if (orderDetail == null) fetchOrderDetail();
    if (orderDetail != null && productData == null)
      fetchProductsData(orderDetail.product_details)
        .then((data) => {
          setProductData(data);
        })
        .catch((err) => console.log(err));
    if (orderDetail != null && productData != null) {
      setIsLoading(false);
    }
  }, [orderDetail, productData]);

  return isLoading ? (
    <ProgressDialog visible={isLoading} label={"Loading..."} />
  ) : (
    <OrderDetailsScreen
      navigation={navigation}
      orderDetail={orderDetail}
      productData={productData}
    />
  );
};

const OrderDetailsScreen = ({ navigation, orderDetail, productData }) => {
  // console.log(orderDetail, productData);

  const trackingStates = {
    Created: 0,
    Processing: 1,
    Delivered: 2,
  };
  const [error, setError] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [statusDisable, setStatusDisable] = useState(false);
  const labels = ["Created", "Processing", "Delivered"];
  const [trackingState, setTrackingState] = useState(
    trackingStates[orderDetail.order_status[0]]
  );

  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: colors.primary,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: colors.primary,
    stepStrokeUnFinishedColor: "#aaaaaa",
    separatorFinishedColor: "#fe7013",
    separatorUnFinishedColor: "#aaaaaa",
    stepIndicatorFinishedColor: "#fe7013",
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: colors.white,
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: "#fe7013",
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "#aaaaaa",
    labelColor: "#999999",
    labelSize: 13,
    currentStepLabelColor: "#fe7013",
  };
  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
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
          <Text style={styles.screenNameText}>Order Details</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>
            View all detail about order
          </Text>
        </View>
      </View>
      <CustomAlert message={error} type={alertType} />
      <ScrollView
        style={styles.bodyContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.containerNameContainer}>
          <View>
            <Text style={styles.containerNameText}>Shipping Address</Text>
          </View>
        </View>
        <View style={styles.ShipingInfoContainer}>
          <Text style={styles.secondarytextSm}>{orderDetail.address}</Text>
        </View>
        <View>
          <Text style={styles.containerNameText}>Order Info</Text>
        </View>
        <View style={styles.orderInfoContainer}>
          <Text style={styles.secondarytextMedian}>
            Order #{String(orderDetail?._id).split("/")[1]}
          </Text>
          <Text style={styles.secondarytextSm}>
            Ordered on {getFormattedDate(orderDetail?.createdAt)}
          </Text>
          <Text style={styles.secondarytextSm}>
            Payment Status: {orderDetail.payment_status}
          </Text>
          <Text style={styles.secondarytextSm}>
            Transaction Id: {orderDetail.transaction_id}
          </Text>
          <View style={{ marginTop: 15, width: "100%" }}>
            <StepIndicator
              customStyles={customStyles}
              currentPosition={trackingState}
              stepCount={3}
              labels={labels}
            />
          </View>
        </View>

        <View style={styles.containerNameContainer}>
          <View>
            <Text style={styles.containerNameText}>Product Details</Text>
          </View>
        </View>
        <View style={styles.orderItemsContainer}>
          <View style={styles.orderItemContainer}>
            <Text style={styles.orderItemText}>
              Order on : {getFormattedDate(orderDetail?.createdAt)}
            </Text>
          </View>
          <ScrollView
            style={styles.orderSummaryContainer}
            nestedScrollEnabled={true}
          >
            {productData.map((product, index) => (
              <View key={index}>
                <BasicProductList
                  image={product.imgUrl}
                  title={product?.name}
                  price={product?.price}
                  quantity={orderDetail.product_details[index].quantity}
                />
              </View>
            ))}
          </ScrollView>
          <View style={styles.orderItemContainer}>
            <Text style={styles.orderItemText}>Total</Text>
            <Text>₹ {orderDetail.amount}</Text>
          </View>
        </View>
        <View style={styles.emptyView}></View>
      </ScrollView>
    </View>
  );
};

export default MyOrderDetails;

const styles = StyleSheet.create({
  container: {
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 0,
    flex: 1,
  },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 10,
    fontSize: 15,
  },
  bodyContainer: { flex: 1, width: "100%", padding: 5 },
  ShipingInfoContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    borderColor: colors.muted,
    elevation: 5,
    marginBottom: 10,
  },
  containerNameContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  containerNameText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.muted,
  },
  secondarytextSm: {
    color: colors.muted,
    fontSize: 13,
  },
  orderItemsContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,

    borderColor: colors.muted,
    elevation: 3,
    marginBottom: 10,
  },
  orderItemContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderItemText: {
    fontSize: 13,
    color: colors.muted,
  },
  orderSummaryContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    maxHeight: 220,
    width: "100%",
    marginBottom: 5,
  },
  bottomContainer: {
    backgroundColor: colors.white,
    width: "110%",
    height: 70,
    borderTopLeftRadius: 10,
    borderTopEndRadius: 10,
    elevation: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingLeft: 10,
    paddingRight: 10,
  },
  orderInfoContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,

    borderColor: colors.muted,
    elevation: 1,
    marginBottom: 10,
  },
  primarytextMedian: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "bold",
  },
  secondarytextMedian: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "bold",
  },
  emptyView: {
    height: 20,
  },
});
