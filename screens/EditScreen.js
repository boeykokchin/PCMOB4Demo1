import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

export default function EditScreen({ navigation, route }) {
  const [editText, setEditText] = useState(`${route.params.title}`);

  let key = route.params.id;

  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}>
      <Text style={{ fontSize: 24, color: 'green' }}>EDIT</Text>
      <TextInput
        style={styles.textInput}
        value={editText}
        onChangeText={(newEditText) => setEditText(newEditText)}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Notes', { editText, key })}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      {/* <Text>{text.toUpperCase()}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    borderColor: 'grey',
    borderWidth: 1,
    width: '80%',
    padding: 10,
    marginTop: 20,
  },
  button: {
    padding: 10,
    backgroundColor: 'orange',
    borderRadius: 5,
    margin: 10,
    marginTop: 30,
    width: 80,
  },
  buttonText: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});
