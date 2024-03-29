import { StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';

export default function TabTwoScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  
  const handleSearchSubmit = () => {
    console.log(searchText);
    router.push(`/modal?searchText=${encodeURIComponent(searchText)}`);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={{...styles.searchBar, color: 'white'}}
          placeholder="Search..."
          placeholderTextColor="white"
          onChangeText={text => setSearchText(text)}
          onSubmitEditing={handleSearchSubmit}
        />
      </View>
        <View style={styles.container}>
        <Text style={styles.title}>Tab Two</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="app/(tabs)/two.tsx" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    alignSelf: 'flex-start',
    width: '100%',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 7,
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
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
});
