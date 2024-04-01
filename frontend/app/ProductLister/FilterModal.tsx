import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View, TextInput } from "react-native";
import styles from "./styles";

interface FilterModalProps {
  applyFilters: (filters: any) => void;
  visible: boolean;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  applyFilters,
  visible,
  onClose,
}) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [isNew, setIsNew] = useState(false);

  const handleApplyFilters = () => {
    applyFilters({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating !== "" ? Number(minRating) : undefined,
      condition: isNew ? "New" : "Used",
    });
    onClose();
  };
  const handleResetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setIsNew(false);
    applyFilters({
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      condition: undefined,
    });
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
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.priceRangeContainer}>
            <TextInput
              placeholder="Min Price"
              value={minPrice}
              onChangeText={setMinPrice}
              keyboardType="numeric"
              style={styles.input}
            />
            <Text style={styles.rangeSeparator}>-</Text>
            <TextInput
              placeholder="Max Price"
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <Text style={styles.sectionTitle}>Minimum Rating</Text>
          <View style={styles.ratingOptions}>
            <TouchableOpacity onPress={() => setMinRating("5")}>
              <Text
                style={[
                  styles.ratingOption,
                  minRating === "5" && styles.selectedRating,
                ]}
              >
                5
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMinRating("4")}>
              <Text
                style={[
                  styles.ratingOption,
                  minRating === "4" && styles.selectedRating,
                ]}
              >
                4+
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMinRating("3")}>
              <Text
                style={[
                  styles.ratingOption,
                  minRating === "3" && styles.selectedRating,
                ]}
              >
                3+
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMinRating("2")}>
              <Text
                style={[
                  styles.ratingOption,
                  minRating === "2" && styles.selectedRating,
                ]}
              >
                2+
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMinRating("1")}>
              <Text
                style={[
                  styles.ratingOption,
                  minRating === "1" && styles.selectedRating,
                ]}
              >
                1+
              </Text>
            </TouchableOpacity>
            {/* Add more rating options if needed */}
          </View>

          <Text style={styles.sectionTitle}>Condition</Text>
          <View style={styles.conditionOptions}>
            <TouchableOpacity onPress={() => setIsNew(true)}>
              <Text
                style={[
                  styles.conditionOption,
                  isNew && styles.selectedCondition,
                ]}
              >
                New
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsNew(false)}>
              <Text
                style={[
                  styles.conditionOption,
                  !isNew && styles.selectedCondition,
                ]}
              >
                Used
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleApplyFilters}
            style={styles.applyButton}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleResetFilters}
            style={styles.resetButton}
          >
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
