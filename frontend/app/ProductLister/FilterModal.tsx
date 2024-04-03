import React from "react";
import {
  Modal,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
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
  const [minPrice, setMinPrice] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState("");
  const [minRating, setMinRating] = React.useState("");
  const [isNew, setIsNew] = React.useState(false);

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={onClose}>
              <View style={styles.filterModalCancelButton}></View>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Price Range</Text>
            <View style={styles.priceRangeContainer}>
              <TextInput
                placeholder="Min Price"
                value={minPrice}
                onChangeText={setMinPrice}
                keyboardType="number-pad"
                style={styles.input}
              />
              <Text style={styles.rangeSeparator}>-</Text>
              <TextInput
                placeholder="Max Price"
                value={maxPrice}
                onChangeText={setMaxPrice}
                keyboardType="number-pad"
                style={styles.input}
              />
            </View>
            <Text style={styles.sectionTitle}>Minimum Rating</Text>
            <View style={styles.ratingOptions}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  onPress={() =>
                    setMinRating((prevRating) =>
                      prevRating === String(rating) ? "" : String(rating)
                    )
                  }
                >
                  <Text
                    style={[
                      styles.ratingOption,
                      minRating === String(rating) && styles.selectedRating,
                    ]}
                  >
                    {rating === 5 ? rating : `${rating}+`}
                  </Text>
                </TouchableOpacity>
              ))}
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleApplyFilters}
                style={styles.applyButton}
              >
                <Text style={styles.buttonText}>Apply Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleResetFilters}
                style={styles.resetButton}
              >
                <Text style={styles.buttonText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FilterModal;
