import getProducts from "@/app/ProductLister/DefaultProduct";
import { FontAwesome5 } from "@expo/vector-icons"; // Assuming you're using Expo
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProductBox, { ProductData } from "../../ProductLister/ProductBox";

const ProductListContainer: React.FC = () => {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [products, setProducts] = useState<ProductData[]>([]);
  const {query} = useLocalSearchParams()

  useEffect(() => {
    (async () => {
      setProducts(await getProducts(query as string));
    })()
  }, []);

  // Function to handle sorting
  const handleSortBy = (option: string | null) => {
    setSortBy(option ?? null); // Use nullish coalescing operator to handle null values
  };

  // Function to handle filtering
  const handleFilter = () => {
    setShowFilterModal(true);
  };

  // Function to apply filters
  const applyFilters = (filters: any) => {
    // Apply filters to products
    console.log("Applied filters:", filters);
    setShowFilterModal(false);
  };

  // Filter modal content
  const FilterModal = () => {
    // Define filtering options here
    // For demonstration, I'm just showing some example options
    const filterOptions: Record<string, string[]> = {
      shipping: ["Available", "Not Available"],
      priceRange: ["Under $20", "$20 - $50", "Over $50"],
      rating: [
        "5 Stars",
        "4 Stars & Up",
        "3 Stars & Up",
        "2 Stars & Up",
        "1 Star & Up",
      ],
      seller: ["Walmart", "Target"],
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Options</Text>
            {/* Render filtering options here */}
            {/* For demonstration, I'm just showing example options */}
            {Object.keys(filterOptions).map((option, index) => (
              <View key={index}>
                <Text style={styles.filterOptionTitle}>{option}</Text>
                {filterOptions[option].map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.filterOption}
                    onPress={() => applyFilters({ [option]: item })}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      </Modal>
    );
  };

  // Function to sort products based on selected option
  const sortProducts = (products: ProductData[]) => {
    if (sortBy === "Price") {
      // Sort by price
      return products.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Rating") {
      // Sort by rating
      return products.sort((a, b) => b.rating - a.rating);
    } else {
      // No sorting applied
      return products;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.productName}>Product Name</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleSortBy(null)}
        >
          <FontAwesome5 name="sort" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleFilter}>
          <FontAwesome5 name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {/* Product List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Render sorted and filtered products */}
        {sortProducts(products).map((product, index) => (
          <ProductBox key={index} {...product} />
        ))}
      </ScrollView>
      {/* Filter Modal */}
      <FilterModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Center the items horizontally
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 8,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterOptionTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  filterOption: {
    paddingVertical: 5,
  },
});

export default ProductListContainer;
