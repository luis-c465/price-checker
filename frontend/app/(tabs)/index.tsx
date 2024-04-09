import { router } from 'expo-router';
import { Image, Keyboard, StyleSheet, TextInput, ScrollView, FlatList, TouchableWithoutFeedback } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';

export default function HomeScreen() {
  const [searchText, setSearchText] = useState("");

  const handleSearchSubmit = () => {
    console.log(searchText);
    // router.navigate({pathname: "/photos"})
    router.navigate({pathname: "/products/[query]", params: {query: searchText}})
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}></View>
          <View style={styles.searchContainer}>
          <Image
            style={{ width: 550, height: 330, left: -7, }}
            source={require("../../assets/images/TradeHubLogoV3.png")}
            />
            <Text style={styles.textbody}>Enter a product or snap a picture to find the best price!</Text>
            <TextInput
              style={{...styles.searchBar, color: 'black', fontFamily: 'Helvetica', fontSize: 14, fontWeight: 'normal'}}
              placeholder="Search..."
              placeholderTextColor="gray"
              onChangeText={text => setSearchText(text)}
              onSubmitEditing={handleSearchSubmit}
            />
            <Text style={styles.titleText}></Text>
          </View>
          <View style={styles.creditsContainer}>
            <Text style={styles.creditsText}>Developed by Luis Canada, Marcos Carillo, Jaime Diaz, Xavier Williams, Salvador Frias, Dwene Louis, and Enrique Dominguez</Text>
          </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
    // <Text style={styles.titleText}> Trade Hub</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 0,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderColor: 'gray',
    borderWidth: 0,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    display: 'flex',
    width: '100%',
    paddingHorizontal: 25,
    marginTop: 0,
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderWidth: 0,
  },
  titleText: {
    flex: 1,
    fontFamily: 'Futura',
    fontWeight: 'bold',
    fontSize: 31,
    textAlign: 'left',
    color: 'black',
    borderColor: 'black',
    borderWidth: 0,
    lineHeight: 35,
    paddingTop: 0,
    alignSelf: 'center',
  },
  searchBar: {
    height: 40,
    width: '100%',
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 0,
    paddingHorizontal: 10,
    borderRadius: 25,
    backgroundColor: '#E9E9E9',
  },
  textbody: {
    fontSize: 10,
    alignSelf: 'center',
    fontFamily: 'SpaceMono-Regular',
    fontWeight: 'normal',
    lineHeight: 17.5,
    textAlign: 'center',
    paddingHorizontal: 0,
    paddingBottom: 0,
    marginBottom: 0,
    color: 'black',
    borderColor: 'black',
    borderWidth: 0,
  },
  creditsText: {
    fontSize: 11,
    lineHeight: 13,
    textAlign: 'center',
    color: 'gray',
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderWidth: 0,
    paddingHorizontal: 15,
  },
  creditsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    marginBottom: 6,
    alignSelf: 'stretch',
  }
});
