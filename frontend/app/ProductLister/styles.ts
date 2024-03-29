// styles.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Dark background
    paddingVertical: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // Gradient orange header
  },
  productName: {
    fontSize: 22, // Larger font size
    fontWeight: "bold",
    color: "#fff", // White text for dark mode
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
    backgroundColor: "#333", // Darker modal for dark mode
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff", // White text for dark mode
  },
  filterOptionTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  filterOption: {
    paddingVertical: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "grey",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  closeButton: {
    backgroundColor: "#FF6347",
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  sortOption: {
    fontSize: 18,
    paddingVertical: 10,
  },
  selectedOption: {
    fontSize: 18,
    paddingVertical: 10,
    backgroundColor: "#e6e6e6", // Background color when selected
  },
  cancelText: {
    fontSize: 18,
    paddingVertical: 10,
    color: "red", // Text color for cancel option
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  priceRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  rangeSeparator: {
    fontSize: 16,
  },
  ratingOptions: {
    flexDirection: "row",
    marginBottom: 10,
  },
  ratingOption: {
    fontSize: 16,
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
  },
  selectedRating: {
    backgroundColor: "#e6e6e6",
  },
  conditionOptions: {
    flexDirection: "row",
    marginBottom: 20,
  },
  conditionOption: {
    fontSize: 16,
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
  },
  selectedCondition: {
    backgroundColor: "#e6e6e6",
  },
  applyButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  resetButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  resetButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  iconButtonContainer: {
    flexDirection: "row",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20, // To create a circle
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10, // Adjust margin for spacing
  },
  filterIcon: {
    fontSize: 20,
    color: "white",
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333", // Darker box for dark mode
    padding: 10,
    marginBottom: 10,
    borderRadius: 10, // Rounded corners
    borderWidth: 2, // Add border
    borderColor: "#fff", // White border for dark mode
  },
  productPhoto: {
    width: 120, // Larger product photos
    height: 120,
    marginRight: 10,
    borderRadius: 10, // Rounded corners
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Shadow for product boxes
  },
});

export default styles;
