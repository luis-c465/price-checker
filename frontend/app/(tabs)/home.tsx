import { router } from 'expo-router';
import { StyleSheet, TextInput, ScrollView, FlatList } from 'react-native';

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
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Price{'\n'}Checker</Text>
        <Text style={styles.textbody}>Search for a product, or snap a picture. {'\n'} We'll find the best price!</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={{...styles.searchBar, color: 'white'}}
              placeholder="Search..."
              placeholderTextColor="gray"
              onChangeText={text => setSearchText(text)}
              onSubmitEditing={handleSearchSubmit}
            />

                
          </View>
          <View style={styles.creditsContainer}>
            <Text style={styles.creditsText}>Developed by Luis Canada, Marcos Carillo, Jaime Diaz, Xavier Williams, Salvador Frias, Dwene Louis, and Enrique Dominguez</Text>
          </View>
      </View>
      
    </SafeAreaView>
    // <EditScreenInfo path="app/(tabs)/two.tsx" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 6,
  },
  searchContainer: {
    //flex: 1,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'stretch',
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 5,
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    borderColor: 'black',
    borderWidth: 1,
    lineHeight: 21,
  },
  searchBar: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 25,
  },
  textbody: {
    fontSize: 17,
    lineHeight: 17.5,
    textAlign: 'center',
    paddingHorizontal: 30,
    paddingBottom: 0,
    marginBottom: 0,
    color: 'black',
    borderColor: 'black',
    borderWidth: 1,
  },
  creditsText: {
    fontSize: 11,
    lineHeight: 13,
    textAlign: 'center',
    color: 'gray',
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 15,
  },
  creditsContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 8,
  }
});
