import DescriptionModal from "@/app/ProductLister/DescriptionModal";
import FilterModal from "@/app/ProductLister/FilterModal";
import ProductBox, { ProductData } from "@/app/ProductLister/ProductBox";
import styles from "@/app/ProductLister/styles";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export type ProductListContainerProps = {
  name: string;
  products: ProductData[];
};
const ProductListContainer: React.FC<ProductListContainerProps> = ({
  name,
  products: defaultProductsData,
}) => {
  const [products, setProducts] = useState<ProductData[]>(defaultProductsData);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [showSortingOptions, setShowSortingOptions] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(
    null,
  );
  const [descriptionVisible, setDescriptionVisible] = useState<boolean>(false);

  // Animated value for the gradient
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    // Start the animation when the component mounts
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1500, // Adjust the duration of the animation as needed
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  const interpolateColors = animatedValue.interpolate({
    inputRange: [0, 0.17, 0.33, 0.5, 0.67, 0.83, 0.94, 1],
    outputRange: [
      "#ff0000",
      "#ff7f00",
      "#ffff00",
      "#00ff00",
      "#0000ff",
      "#4b0082",
      "#9400d3",
      "#000000",
    ],
  });

  const animatedStyle = {
    color: interpolateColors,
  };

  const handleDescriptionPress = (
    description: string,
    product: ProductData,
  ) => {
    setSelectedDescription(description);
    setSelectedProduct(product);
    setDescriptionVisible(true);
  };

  const handleSortBy = (option: string | null) => {
    setSortBy(option);
    setShowSortingOptions(false);
  };

  const applyFilters = (filters: any) => {
    // Apply filters to update the list of products
    let filteredProducts = [...defaultProductsData];

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= filters.minPrice,
      );
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= filters.maxPrice,
      );
    }
    if (filters.minRating !== undefined) {
      // Adjust the condition to include products with ratings equal to or greater than the selected rating
      filteredProducts = filteredProducts.filter(
        (product) => product.rating >= filters.minRating,
      );
    }
    if (filters.condition !== undefined) {
      if (filters.condition === "New") {
        filteredProducts = filteredProducts.filter(
          (product) => product.isNew === true,
        );
      } else if (filters.condition === "Used") {
        filteredProducts = filteredProducts.filter(
          (product) => product.isNew === false,
        );
      }
    }

    // Update the list of products with the filtered products
    setProducts(filteredProducts);
    setShowFilterModal(false);
  };

  useEffect(() => {
    const sortProducts = (products: ProductData[], sortBy: string | null) => {
      if (sortBy === "Price") {
        return [...products].sort((a, b) => a.price - b.price);
      } else if (sortBy === "Price-desc") {
        return [...products].sort((a, b) => b.price - a.price);
      } else if (sortBy === "Rating") {
        return [...products].sort((a, b) => b.rating - a.rating);
      } else if (sortBy === "LastUpdated") {
        return [...products].sort(
          (a, b) =>
            new Date(b.lastUpdatedAt).getTime() -
            new Date(a.lastUpdatedAt).getTime(),
        );
      } else {
        return products;
      }
    };

    const sortedProducts = sortProducts(products, sortBy);
    // Check if the products have already been sorted
    if (JSON.stringify(sortedProducts) === JSON.stringify(products)) {
      return;
    }
    setProducts(sortedProducts);
  }, [sortBy]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animated.Text style={[styles.productName, { ...animatedStyle }]}>
          {name}
        </Animated.Text>
        <TouchableOpacity
          style={[styles.iconButton, styles.sortingContainer]}
          onPress={() => setShowSortingOptions(!showSortingOptions)}
        >
          <Text style={styles.sortingOptionText}>
            Sort By: {sortBy ? sortBy : "None"}
          </Text>
          <FontAwesome5 name="chevron-down" style={styles.filterIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowFilterModal(true)}
        >
          <FontAwesome5 name="filter" style={styles.filterIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {products.map((product, index) => (
          <ProductBox
            key={index}
            {...product}
            onPressDescription={() =>
              handleDescriptionPress(product.description, product)
            }
          />
        ))}
      </ScrollView>
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        applyFilters={applyFilters}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSortingOptions}
        onRequestClose={() => setShowSortingOptions(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowSortingOptions(false)}>
          <View style={styles.sortingModalContainer}>
            <View style={styles.sortingOptionsContainer}>
              <TouchableOpacity
                onPress={() => handleSortBy("Rating")}
                style={[
                  styles.sortingOption,
                  sortBy === "Rating" && styles.selectedSortingOption,
                ]}
              >
                <Text style={styles.sortingOptionText}>Sort By Rating</Text>
                {sortBy === "Rating" && (
                  <FontAwesome5
                    name="check"
                    style={styles.sortingOptionCheckIcon}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSortBy("Price")}
                style={[
                  styles.sortingOption,
                  sortBy === "Price" && styles.selectedSortingOption,
                ]}
              >
                <Text style={styles.sortingOptionText}>
                  Sort By Price: Low to High
                </Text>
                {sortBy === "Price" && (
                  <FontAwesome5
                    name="check"
                    style={styles.sortingOptionCheckIcon}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSortBy("Price-desc")}
                style={[
                  styles.sortingOption,
                  sortBy === "Price-desc" && styles.selectedSortingOption,
                ]}
              >
                <Text style={styles.sortingOptionText}>
                  Sort By Price: High to Low
                </Text>
                {sortBy === "Price-desc" && (
                  <FontAwesome5
                    name="check"
                    style={styles.sortingOptionCheckIcon}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSortBy("LastUpdated")}
                style={[
                  styles.sortingOption,
                  sortBy === "LastUpdated" && styles.selectedSortingOption,
                ]}
              >
                <Text style={styles.sortingOptionText}>
                  Sort By Last Updated
                </Text>
                {sortBy === "LastUpdated" && (
                  <FontAwesome5
                    name="check"
                    style={styles.sortingOptionCheckIcon}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* Render DescriptionModal if descriptionVisible is true */}
      {selectedProduct && (
        <DescriptionModal
          visible={descriptionVisible}
          onClose={() => setDescriptionVisible(false)}
          productData={selectedProduct}
        />
      )}
    </View>
  );
};

export default ProductListContainer;
