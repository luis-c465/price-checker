import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ProductData } from "./ProductBox";
import styles from "./styles";

interface DescriptionModalProps {
  visible: boolean;
  onClose: () => void;
  productData: ProductData;
}

const [selectedImage, setSelectedImage] = useState(null);

const DescriptionModal: React.FC<DescriptionModalProps> = ({
  visible,
  onClose,
  productData,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Function to truncate description text to 140 characters
  const truncateDescription = (description: string) => {
    if (description.length > 140 && !showFullDescription) {
      return description.slice(0, 140) + "...";
    }
    return description;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Description</Text>
              <ScrollView>
                <View style={styles.categoryContainer}>
                  <Text style={styles.categoryTitle}>Photos:</Text>
                  <ScrollView horizontal={true}>
                    {[
                      ...productData.photos,
                      "https://via.placeholder.com/100",
                    ].map((photo, index) => (
                      <TouchableOpacity key={index} onPress={() => {}}>
                        <Image
                          source={{ uri: photo }}
                          style={styles.productPhoto}
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.categoryContainer}>
                  <Text style={styles.categoryTitle}>Description:</Text>
                  <Text style={styles.textStyle}>
                    {truncateDescription(productData.description)}
                  </Text>
                  {productData.description.length > 140 &&
                    !showFullDescription && (
                      <TouchableOpacity
                        onPress={() => setShowFullDescription(true)}
                      >
                        <Text style={styles.showMoreButton}>Show More</Text>
                      </TouchableOpacity>
                    )}
                  {showFullDescription && (
                    <TouchableOpacity
                      onPress={() => setShowFullDescription(false)}
                    >
                      <Text style={styles.showMoreButton}>Show Less</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.categoryContainer}>
                  <Text style={styles.categoryTitle}>Last Updated:</Text>
                  <Text style={styles.textStyle}>
                    {productData.lastUpdatedAt}
                  </Text>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DescriptionModal;
