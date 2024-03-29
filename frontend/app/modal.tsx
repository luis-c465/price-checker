import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import ProductBox, { ProductData } from "./ProductLister/ProductBox";
import { defaultProductsData } from "./ProductLister/DefaultProduct";
import FilterModal from "./ProductLister/FilterModal";
import SortModal from "./ProductLister/SortModal";
import styles from "./ProductLister/styles";
import DescriptionModal from "./ProductLister/DescriptionModal";

interface ProductListContainerProps {
  products?: ProductData[];
}

const ProductListContainer: React.FC<ProductListContainerProps> = ({}) => {
  const [products, setProducts] = useState<ProductData[]>(defaultProductsData);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showUsedProducts, setShowUsedProducts] = useState(false);
  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(
    null
  );

  const handleDescriptionPress = (
    description: string,
    product: ProductData
  ) => {
    setSelectedDescription(description);
    setSelectedProduct(product);
    setDescriptionVisible(true);
  };

  const sortProducts = (products: ProductData[], sortBy: string | null) => {
    if (sortBy === "Price") {
      return [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price-desc") {
      return [...products].sort((a, b) => b.price - a.price);
    } else if (sortBy === "Rating") {
      return [...products].sort((a, b) => b.rating - a.rating);
    } else {
      return products;
    }
  };

  useEffect(() => {
    const sortedProducts = sortProducts(products, sortBy);
    // Check if the products have already been sorted
    if (JSON.stringify(sortedProducts) === JSON.stringify(products)) {
      return;
    }
    setProducts(sortedProducts);
  }, [sortBy]);

  const handleSortBy = (option: string | null) => {
    setSortBy(option);
    setShowSortModal(false);
  };

  const handleSort = () => {
    setShowSortModal(true);
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  const applyFilters = (filters: any) => {
    // Apply filters to update the list of products
    let filteredProducts = [...defaultProductsData];

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= filters.minPrice
      );
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= filters.maxPrice
      );
    }
    if (filters.minRating !== undefined) {
      // Adjust the condition to include products with ratings equal to or greater than the selected rating
      filteredProducts = filteredProducts.filter(
        (product) => product.rating >= filters.minRating
      );
    }
    if (filters.condition !== undefined) {
      if (filters.condition === "New") {
        filteredProducts = filteredProducts.filter(
          (product) => product.isNew === true
        );
      } else if (filters.condition === "Used") {
        filteredProducts = filteredProducts.filter(
          (product) => product.isNew === false
        );
      }
    }

    // Update the list of products with the filtered products
    setProducts(filteredProducts);
    setShowFilterModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.productName}>Product Name</Text>
        <View style={styles.iconButtonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={handleFilter}>
            <FontAwesome5 name="filter" style={styles.filterIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleSort}>
            <FontAwesome5 name="sort" style={styles.filterIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {products.map((product, index) => (
          <ProductBox
            key={index}
            onPressDescription={() =>
              handleDescriptionPress(product.description, product)
            }
            {...product}
          />
        ))}
      </ScrollView>
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        applyFilters={applyFilters}
      />
      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        applySort={handleSortBy}
      />
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
