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
        <Text style={styles.title}>Price Checker</Text>
        <Text style={styles.textbody}>{'\n'}Project made during INIT Build 2024 for the Mobile Dev team. {'\n'}{'\n'}Search for a product, or snap a picture. {'\n'} We'll find the best price!</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={{...styles.searchBar, color: 'white'}}
              placeholder="Search..."
              placeholderTextColor="white"
              onChangeText={text => setSearchText(text)}
              onSubmitEditing={handleSearchSubmit}
            />
              <Text style={styles.textbody}>Developed by: </Text>
              <Text style={styles.textbody}>Luis Canada</Text>
              <Text style={styles.textbody}>Marcos Carillo</Text>
              <Text style={styles.textbody}>Jaime Diaz</Text>
              <Text style={styles.textbody}>Xavier Williams</Text>
              <Text style={styles.textbody}>Salvador Frias</Text>
              <Text style={styles.textbody}>Dwene Louis</Text>
              <Text style={styles.textbody}>Enrique Dominguez</Text>
          </View>
      </View>
      
    </SafeAreaView>
    // <EditScreenInfo path="app/(tabs)/two.tsx" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'black',
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 0,
    height: 1,
    width: '80%',
  },
  searchBar: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  textbody: {
    fontSize: 15,
    lineHeight: 17.5,
    textAlign: 'center',
    paddingHorizontal: 30,
    paddingBottom: 0,
    marginBottom: 1,
  },
  contributorsList: {
    height: 100,
    marginTop: 2,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 6,
    borderWidth: .2,
    borderColor: 'gray',
  },
});
