import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Global Styles
  container: {
    flex: 1,
    backgroundColor: "#fff", // Light background
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
  },
  sortingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginHorizontal: 10,
  },
  sortingOptionText: {
    marginRight: 5,
    fontWeight: "bold",
  },
  sortingModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sortingOptionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  sortingOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  selectedSortingOption: {
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  sortingOptionCheckIcon: {
    color: "#fff",
  },
  gradient: {
    flex: 1,
    borderRadius: 5, // Adjust as needed
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000", // Black text for light mode
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
    backgroundColor: "#fff", // Lighter modal for light mode
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000", // Black text for light mode
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
    backgroundColor: "#fff",
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
  DescriptionModal: {
    marginTop: 50,
    height: "80%", // adjust as needed
    width: "90%", // adjust as needed
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  textStyle: {
    color: "#000",
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
  // End of Global Styles

  // Specific Styles
  closeButton: {
    backgroundColor: "#FF6347",
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
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
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  resetButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  iconButtonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    flexDirection: "row", // Align buttons horizontally
    alignItems: "center", // Align buttons to the right
  },
  iconButton: {
    width: 100,
    height: 40,
    left: 50,
    justifyContent: "center",
    marginLeft: 10,
  },
  filterIcon: {
    fontSize: 20,
    color: "#000", // Black icon for light mode
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000", // Black text for light mode
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent", // Transparent background
    padding: 10,
    marginBottom: 10,
    borderRadius: 10, // Rounded corners
    borderWidth: 1, // Add border
    borderColor: "#ccc", // Light gray border for modern look
  },
  productPhoto: {
    width: 200, // Longer product photos
    height: 120,
    marginRight: 10,
    borderRadius: 10, // Rounded corners
    // Shadow removed for a cleaner look
  },
  photoDotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  photoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "gray",
    marginHorizontal: 5,
  },
  selectedPhotoDot: {
    backgroundColor: "grey",
  },
  showMoreButton: {
    color: "blue", // Change color as desired
    marginTop: 5,
  },
});

export default styles;
