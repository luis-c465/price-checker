import React from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import styles from "./styles";
import { ProductData } from "./ProductBox";

interface DescriptionModalProps {
  visible: boolean;
  onClose: () => void;
  productData: ProductData;
}

const DescriptionModal: React.FC<DescriptionModalProps> = ({
  visible,
  onClose,
  productData,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Description</Text>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Photos:</Text>
            <ScrollView horizontal={true}>
              {productData.photos.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: photo }}
                  style={styles.productPhoto}
                />
              ))}
            </ScrollView>
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Measurements:</Text>
            <Text>{productData.measurements}</Text>
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Description:</Text>
            <Text>{productData.description}</Text>
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Quantity:</Text>
            <Text>{productData.quantity}</Text>
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Last Updated:</Text>
            <Text>{productData.lastUpdatedAt}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default DescriptionModal;
