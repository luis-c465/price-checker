import React, { useState } from "react";
import {
  Image,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import StarRating from "./StarRating";

type LogoKey = "ebay" | "amazon" | "homedepot" | "walmart" | "alibaba" | "bestbuy" | "craigslist" | "etsy" | "ikea" | "mercari" | "reverb" | "offerup" | "wayfair"
const logoImages: Record<LogoKey, any> = {
  "alibaba": require("../../assets/images/logos/Alibaba_logo.svg"),
  "amazon": require("../../assets/images/logos/Amazon_logo.svg"),
  "bestbuy": require("../../assets/images/logos/Best_Buy_Logo.svg"),
  "craigslist": require("../../assets/images/logos/Craigslist.svg"),
  "ebay": require("../../assets/images/logos/EBay_logo.svg"),
  "etsy": require("../../assets/images/logos/Etsy_logo.svg"),
  "ikea": require("../../assets/images/logos/Ikea_logo.svg"),
  "mercari": require("../../assets/images/logos/Mercari_logo_2018.svg"),
  "reverb": require("../../assets/images/logos/Reverb_logo.svg"),
  "homedepot": require("../../assets/images/logos/TheHomeDepot.svg"),
  "walmart": require("../../assets/images/logos/Walmart_logo.svg"),
  "offerup": require("../../assets/images/logos/OfferUp_Logo.svg"),
  "wayfair": require("../../assets/images/logos/Wayfair_logo.svg"),
};

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
  logo: LogoKey
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
  photos,
  url,
  logo
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleRedirect = () => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL: ", err)
    );
  };

  const LogoImage = logoImages[logo] || null;

  return (
    <View style={styles.productBox}>
      {isNew && (
        <View style={styles.bookmark}>
          <Text style={styles.bookmarkText}>New</Text>
        </View>
      )}
      <TouchableOpacity onPress={() => setSelectedImage(photos[0])}>
        <View style={styles.imageContainer}>
          {photos.length > 0 && (
            <Image source={{ uri: photos[0] }} style={styles.image} />
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
        <Text style={styles.shipping}>Shipping: ${shipping.toFixed(2)}</Text>
        <TouchableOpacity onPress={onPressDescription}>
          <Text style={styles.description}>Show More...</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.starOverlay}>
        <StarRating rating={rating} />
        <TouchableOpacity onPress={handleRedirect}>
          {LogoImage && <Image source={LogoImage} resizeMode="contain" />}
        </TouchableOpacity>
        <View style={styles.ratingCounter}>
          <Text style={styles.ratingCounterText}>{num_ratings}</Text>
        </View>
      </View>
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={!!selectedImage}
        onRequestClose={() => setSelectedImage(null)}
      >
        <TouchableOpacity
          style={styles.imagePopupBackground}
          onPress={() => setSelectedImage(null)}
          activeOpacity={1}
        >
          {selectedImage && (
            <TouchableOpacity
              style={styles.imagePopupContainer}
              onPress={(e) => e.stopPropagation()}
              activeOpacity={1}
            >
              <Image
                source={{ uri: selectedImage }}
                style={styles.imagePopup}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export const styles = StyleSheet.create({
  productBox: {
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#f0f0f0", // Light gray background color
    flexDirection: "row",
    overflow: "visible",
    width: "90%",
    position: "relative",
    alignSelf: "center",
    marginTop: 20,
    minHeight: 150, // Set minimum height to accommodate content
    justifyContent: "center", // Center content vertically
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    marginRight: 10,
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center", // Center content vertically
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000", // Black text color for light mode
  },
  shipping: {
    fontSize: 12,
    color: "#777777", // Slightly darker gray for shipping text
    marginBottom: 15,
  },
  bold: {
    fontWeight: "bold",
  },
  starOverlay: {
    flexDirection: "row",
    transform: [{ translateX: -30 }],
  },
  description: {
    color: "rgb(6, 84, 186)",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff", // Light background color for modal content
    padding: 20,
    borderRadius: 10,
    width: "80%",
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: "#000000", // Black text color for modal description
  },
  closeButton: {
    backgroundColor: "#2196f3", // Adjusted blue color for close button
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  closeText: {
    color: "#ffffff", // White text color for close text
  },
  ratingCounter: {
    position: "absolute",
    top: 5,
    transform: [{ translateX: 103 }, { translateY: -10 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  ratingCounterText: {
    color: "#ffffff", // White text color for rating counter
    fontSize: 12,
  },
  redirectBox: {
    position: "absolute",
    bottom: 30,
    left: 35,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
  },
  redirectLogo: {
    width: 50, // Set the width of the logo
    height: 50, // Set the height of the logo
  },
  imagePopupBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePopupContainer: {
    backgroundColor: "#ffffff", // Light background color for image popup container
    borderRadius: 10,
    padding: 20,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imagePopup: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  bookmark: {
    position: "absolute",
    top: 10,
    left: -20, // Adjusted left position to overlap the image
    backgroundColor: "#ff0000", // Red color for bookmark
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    transform: [{ rotate: "-45deg" }], // Rotate the bookmark diagonally
    zIndex: 1, // Ensure the bookmark is above other elements
  },
  bookmarkText: {
    color: "#ffffff", // White text color for bookmark
    fontWeight: "bold",
    zIndex: 1,
  },
});

export default ProductBox;
