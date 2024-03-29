// ProductBox.tsx
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import StarRating from "./StarRating";

export interface ProductData {
  price: number;
  shipping: number;
  condition?: boolean;
  seller: string;
  description: string;
  num_ratings: number;
  rating: number;
  photos: string[];
  seller_num_ratings: number;
  seller_avg_ratings: number;
  measurements: string;
  quantity: number;
  lastUpdatedAt: string;
  url: string;
  isNew: boolean;
}

interface ProductBoxProps extends ProductData {}

const ProductBox: React.FC<ProductBoxProps> = ({
  price,
  shipping,
  seller,
  description,
  rating,
  isNew,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Calculate the number of empty stars (5 - rating)
  const filledStars = Math.round(rating);
  const emptyStars = 5 - filledStars;

  return (
    <View style={styles.productBox}>
      {isNew && (
        <View style={styles.newLabel}>
          <Text style={styles.newText}>New</Text>
          <Text style={styles.newDot}>•</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.whiteText}>
          <Text style={styles.bold}>Buy now:</Text> ${price.toFixed(2)}
        </Text>
        <Text style={styles.whiteText}>
          <Text style={styles.bold}>Shipping:</Text> ${shipping.toFixed(2)}
        </Text>
        <Text style={styles.whiteText}>
          <Text style={styles.bold}>Seller/Brand:</Text> {seller}
        </Text>
        <TouchableOpacity onPress={() => setShowFullDescription(true)}>
          <Text style={styles.description}>
            <Text style={styles.bold}>Description</Text> {}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.starOverlay}>
        <StarRating rating={rating} />
      </View>
      {/* Modal for full description */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFullDescription}
        onRequestClose={() => setShowFullDescription(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalDescription}>{description}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFullDescription(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  productBox: {
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#333333",
    flexDirection: "row",
    justifyContent: "space-between", // Center items horizontally
    overflow: "visible", // Allow content to overflow the container
    width: "90%", // Set a fixed width for the product box
    marginLeft: 30,
    position: "relative", // Ensure relative positioning for absolute elements
    alignSelf: "center", // Center the product boxes horizontally
    marginTop: 20, // Add some top margin to create space below the header
  },
  content: {
    flex: 1, // Take remaining space
    marginRight: 10, // Add margin to create space between content and stars
  },
  bold: {
    fontWeight: "bold",
  },
  newLabel: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    top: -10,
    left: -40,
    backgroundColor: "red",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 1,
    transform: [{ rotate: "-45deg" }],
  },
  newText: {
    color: "white",
    fontSize: 13,
    fontWeight: "900"
  },
  newDot: {
    color: "white",
    fontSize: 20,
    fontWeight: "900"
  },
  whiteText: {
    color: "white",
  },
  starOverlay: {
    flexDirection: "row", // Ensure stars are aligned horizontally
  },
  star: {
    color: "#ffd700",
    fontSize: 20, // Set the font size of stars
  },
  starOutline: {
    color: "#ffd700",
    fontSize: 20, // Set the font size of stars
    opacity: 0.3, // Set opacity to create outline effect
  },
  description: {
    color: "cyan",
    marginTop: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  closeText: {
    color: "white",
  },
});

export default ProductBox;
