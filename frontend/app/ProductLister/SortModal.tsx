import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "./styles";

interface SortModalProps {
  applySort: (option: string | null) => void;
  visible: boolean;
  onClose: () => void;
}

const SortModal: React.FC<SortModalProps> = ({
  applySort,
  visible,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSortOption = (option: string) => {
    setSelectedOption(option);
    applySort(option);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onClose}>
            <View style={styles.sortModalCancelButton}></View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSortOption("Rating")}>
            <Text
              style={
                selectedOption === "Rating"
                  ? styles.selectedOption
                  : styles.sortOption
              }
            >
              Sort By Rating
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSortOption("Price")}>
            <Text
              style={
                selectedOption === "Price-asc"
                  ? styles.selectedOption
                  : styles.sortOption
              }
            >
              Sort By Price: Low to High
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSortOption("Price-desc")}>
            <Text
              style={
                selectedOption === "Price-desc"
                  ? styles.selectedOption
                  : styles.sortOption
              }
            >
              Sort By Price: High to Low
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SortModal;
