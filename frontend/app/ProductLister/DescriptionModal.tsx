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
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose}>
            <View style={styles.DescriptionModalCancelButton}></View>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Description</Text>
          <ScrollView>
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
              <Text style={styles.textStyle}>{productData.measurements}</Text>
            </View>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>Description:</Text>
              <Text style={styles.textStyle}>{productData.description}</Text>
            </View>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>Quantity:</Text>
              <Text style={styles.textStyle}> {productData.quantity}</Text>
            </View>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>Last Updated:</Text>
              <Text style={styles.textStyle}>{productData.lastUpdatedAt}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default DescriptionModal;
