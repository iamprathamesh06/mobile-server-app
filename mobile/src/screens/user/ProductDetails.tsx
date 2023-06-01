import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  StatusBar,
  Text,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import cartIcon from "../../assets/icons/cart_beg.png";
import { colors, network } from "../../constants";
import CustomButton from "../../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { useCart } from "../../context/CartContext";
import ProductCard from "../../components/ProductCard";
import { FlatList } from "react-native-gesture-handler";
import ButtonGroup from "../../components/Group/ButtonGroup";
import { gql } from "@apollo/client";
import { client } from "../../client/ApolloClient";
import { getFormattedDate } from "../../utils/getFormattedDate";
import BasicProductList from "../../components/BasicProductList/BasicProductList";
import BasicIngredientsList from "../../components/BasicIngredientsList/BasicIngredientsList";

const GET_INGREDIENT_QUERY = gql`
  query GetIngredient($id: String!) {
    grain(id: $id) {
      _id
      name
      description
      type
      price
      nutrition
      imgUrl
    }
  }
`;

export default function ProductDetails({ navigation, route }) {
  const handleProductPress = (product) => {
    navigation.replace("ProductDetails", { product, products });
  };

  const { cartProducts, addToCart } = useCart();
  const { product, products } = route.params;
  const [error, setError] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [quantity, setQuantity] = useState(1);
  const [ingredientsData, setIngredientsData] = useState([]);
  console.log(product);

  const fetchIngredientsData = async (ingredients) => {
    try {
      const ingredientsData = await Promise.all(
        ingredients.map((ingredient) => {
          const { grain_id } = ingredient;
          return client.query({
            query: GET_INGREDIENT_QUERY,
            variables: { id: grain_id },
          });
        })
      );

      const ingredientList = ingredientsData.map(
        (response) => response.data.grain
      );
      setIngredientsData(ingredientList);
    } catch (error) {
      console.error("Error fetching ingredients data:", error);
    }
  };

  useEffect(() => {
    fetchIngredientsData(product.ingredients);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
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

        {/* <View></View> */}
        <TouchableOpacity
          style={styles.cartIconContainer}
          onPress={() => navigation.navigate("Cart")}
        >
          {cartProducts.length > 0 ? (
            <View style={styles.cartItemCountContainer}>
              <Text style={styles.cartItemCountText}>
                {cartProducts.length}
              </Text>
            </View>
          ) : (
            <></>
          )}
          <Image source={cartIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.productImageContainer}>
          <Image source={{ uri: product.imgUrl }} style={styles.productImage} />
        </View>

        <CustomAlert message={error} type={alertType} />

        <View style={styles.productInfoContainer}>
          <ScrollView style={styles.productInfoTopContainer}>
            <View style={styles.productNameContaier}>
              <Text style={styles.productNameText}>{product?.name}</Text>
            </View>
            <View style={styles.productDetailContainer}>
              <View style={styles.productSizeOptionContainer}></View>
              <View style={styles.productPriceContainer}>
                <Text style={styles.secondaryTextSm}>Price:</Text>
                <Text style={styles.primaryTextSm}>{product?.price} ₹/Kg</Text>
              </View>
            </View>
            <View style={styles.productDescriptionContainer}>
              <Text style={styles.secondaryTextSm}>Description:</Text>
              <Text>{product?.description}</Text>
            </View>

            <ButtonGroup quantity={quantity} setQuantity={setQuantity} />

            {/* Another for Grains Description */}
            <View style={styles.containerNameContainer}>
              <View>
                <Text style={styles.containerNameText}>
                  Ingredients Details
                </Text>
              </View>
            </View>
            <View style={styles.orderItemsContainer}>
              <View style={styles.orderItemContainer}>
                {/* <Text style={styles.orderItemText}>Order on</Text> */}
              </View>
              <ScrollView
                style={styles.orderSummaryContainer}
                nestedScrollEnabled={true}
              >
                {console.log(ingredientsData)}
                {ingredientsData.map((ingredient, index) => (
                  <View key={index}>
                    <BasicIngredientsList
                      image={ingredient.imgUrl}
                      title={ingredient?.name}
                      type={ingredient.type}
                      nutrition={ingredient.nutrition}
                      description={ingredient.description}
                      proportion={product.ingredients[index].proportion}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Ended Here */}

            <View style={styles.primaryTextContainer}>
              <Text style={styles.primaryText}>Similar Products</Text>
            </View>
            <View style={styles.productCardContainer}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                initialNumToRender={5}
                horizontal={true}
                data={products}
                renderItem={({ item, index }) => (
                  <View
                    key={item._id}
                    style={{ marginLeft: 5, marginBottom: 10, marginRight: 5 }}
                  >
                    <ProductCard
                      name={item.name}
                      image={item.imgUrl}
                      price={item.price}
                      limit={15}
                      disabledCartIcon={
                        cartProducts.find((p: any) => p._id == item._id)
                          ? true
                          : false
                      }
                      onPress={() => handleProductPress(item)}
                      onPressSecondary={() => addToCart(item, 1)}
                    />
                  </View>
                )}
              />
            </View>
          </ScrollView>

          <View style={styles.productInfoBottomContainer}>
            <View style={styles.productButtonContainer}>
              {cartProducts.find((p: any) => p._id == product._id) ? (
                <CustomButton
                  text={"Item Already Added in the Cart"}
                  disabled={true}
                ></CustomButton>
              ) : (
                <CustomButton
                  text={"Add to Cart"}
                  onPress={() => {
                    addToCart(product, quantity);
                  }}
                />
              )}
            </View>
          </View>
        </View>
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
    flex: 1,
  },
  orderSummaryContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 5,
    maxHeight: 220,
    width: "100%",
    marginBottom: 5,
  },
  primaryTextContainer: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingBottom: 10,
    marginTop: 50,
  },
  containerNameText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.muted,
  },
  orderItemsContainer: {
    margin: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    paddingHorizontal: 0,
    paddingVertical: 10,
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
  primaryText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  productCardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 240,
    paddingHorizontal: 10,
    paddingTop: 0,
  },
  containerNameContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  topBarContainer: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  productImageContainer: {
    width: "100%",
    flex: 1,
    backgroundColor: colors.light,
    flexDirecion: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 0,
  },
  productInfoContainer: {
    width: "100%",
    flex: 3,
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    elevation: 25,
  },
  productImage: {
    height: "100%",
    width: 300,
    resizeMode: "contain",
  },
  productInfoTopContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "flex-start",
    width: "100%",
    flex: 1,
  },
  productInfoBottomContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: colors.light,
    width: "100%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  productButtonContainer: {
    padding: 20,
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: colors.white,
    width: "100%",
    height: 100,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  productNameContaier: {
    padding: 5,
    paddingLeft: 20,
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  productNameText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  infoButtonContainer: {
    padding: 5,
    paddingRight: 0,
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  wishlistButtonContainer: {
    height: 50,
    width: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.light,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  productDetailContainer: {
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 5,
  },
  secondaryTextSm: { fontSize: 15, fontWeight: "bold" },
  primaryTextSm: { color: colors.primary, fontSize: 15, fontWeight: "bold" },
  productDescriptionContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  counterContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: 50,
  },
  counter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  counterButtonContainer: {
    display: "flex",
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.muted,
    borderRadius: 15,
    elevation: 2,
  },
  counterButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
  },
  counterCountText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cartIconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cartItemCountContainer: {
    position: "absolute",
    zIndex: 10,
    top: -10,
    left: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 22,
    width: 22,
    backgroundColor: colors.danger,
    borderRadius: 11,
  },
  cartItemCountText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 10,
  },
});
