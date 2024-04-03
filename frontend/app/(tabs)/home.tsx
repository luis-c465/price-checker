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
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Price{'\n'}Checker</Text>
          <Text style={styles.textbody}>Search for a product, or snap a picture. {'\n'} We'll find the best price!</Text>
        </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={{...styles.searchBar, color: 'black', fontFamily: 'Helvetica', fontSize: 14, fontWeight: 'normal'}}
              placeholder="Search..."
              placeholderTextColor="gray"
              onChangeText={text => setSearchText(text)}
              onSubmitEditing={handleSearchSubmit}
            />
          </View>
          <View style={styles.creditsContainer}>
            <Text style={styles.creditsText}>Developed by Luis Canada, Marcos Carillo, Jaime Diaz, Xavier Williams, Salvador Frias, Dwene Louis, and Enrique Dominguez</Text>
      </View>
    </SafeAreaView>
    // <EditScreenInfo path="app/(tabs)/two.tsx" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 6,
    justifyContent: 'flex-start',
  },
  searchContainer: {
    //flex: 1,
    alignSelf: 'center',
    display: 'flex',
    width: '100%',
    paddingHorizontal: 25,
    marginTop: 0,
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
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 0,
    paddingHorizontal: 10,
    borderRadius: 25,
    backgroundColor: '#E9E9E9',
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
    justifyContent: 'flex-end',
    marginBottom: 8,
    alignSelf: 'stretch',
  }
});
