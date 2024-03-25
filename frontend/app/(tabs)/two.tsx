import { StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import React, { useState } from 'react';

export default function TabTwoScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const SearchContext = React.createContext('');
  
  const handleSearchSubmit = () => {
    console.log(searchText);
    router.push('/modal');
  };
  
  return (
    <SearchContext.Provider value={searchText}>
    <View style={styles.container}>
      <TextInput
        style={{...styles.searchBar, color: 'white'}}
        placeholder="Search..."
        placeholderTextColor="white"
        onChangeText={text => setSearchText(text)}
        onSubmitEditing={handleSearchSubmit}
      />
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
    </SearchContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  searchBar: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
});
