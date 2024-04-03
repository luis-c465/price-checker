import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import StarRating from "./StarRating";

export interface ProductData {
  price: number;
  shipping: number;
  seller: string;
  description: string;
  rating: number;
  isNew: boolean;
  condition: boolean;
  num_ratings: number;
  photos: string[];
  seller_num_ratings: number;
  seller_avg_ratings: number;
  measurements: string;
  quantity: number;
  lastUpdatedAt: string;
  url: string;
}

interface ProductBoxProps extends ProductData {
  onPressDescription: () => void;
}

const ProductBox: React.FC<ProductBoxProps> = ({
  price,
  shipping,
  seller,
  description,
  rating,
  isNew,
  onPressDescription,
  num_ratings,
  url,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Calculate the number of empty stars (5 - rating)
  const filledStars = Math.round(rating);
  const emptyStars = 5 - filledStars;
  const handleRedirect = () => {
    Linking.openURL(
      "https://www.amazon.com/s?k=bass&i=stripbooks&ref=nb_sb_noss"
    ).catch((err) => console.error("Failed to open URL: ", err));
  };
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
        <TouchableOpacity onPress={onPressDescription}>
          <Text style={styles.description}>Description</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.starOverlay}>
        <StarRating rating={rating} />
        <TouchableOpacity onPress={handleRedirect} style={styles.redirectBox}>
          <Text style={styles.redirectText}>Redirect</Text>
        </TouchableOpacity>
        {/* Display number of ratings */}
        <View style={styles.ratingCounter}>
          <Text style={styles.ratingCounterText}>{num_ratings}</Text>
        </View>
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
    fontWeight: "900",
  },
  newDot: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
  },
  whiteText: {
    color: "white",
  },
  starOverlay: {
    flexDirection: "row",
    transform: [{ translateX: -30 }], // Ensure stars are aligned horizontally
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
  ratingCounter: {
    position: "absolute",
    top: 5,
    transform: [{ translateX: 103 }, { translateY: -10 }], // Move the counter to the right
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  ratingCounterText: {
    color: "#fff",
    fontSize: 12,
  },
  redirectBox: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "blue",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  redirectText: {
    color: "#fff",
  },
});

export default ProductBox;
