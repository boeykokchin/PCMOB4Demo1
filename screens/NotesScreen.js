import React, { useEffect, useState } from 'react';
import firebase from '../database/firebaseDB';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotesScreen({ navigation, route }) {
  const [notes, setNotes] = useState([]);

  // This is to set up the top right button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addNote}>
          <Ionicons
            name='ios-create-outline'
            size={30}
            color='black'
            style={{
              color: '#f55',
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('todos')
      .orderBy('id', 'asc')
      .onSnapshot((snapshot) => {
        const updatedNotes = snapshot.docs.map((doc) => doc.data());
        setNotes(updatedNotes);
        console.log('@useEffect_Unsubscribe', updatedNotes);
      });
    return () => {
      unsubscribe();
    };
  }, []);

  // Monitor route.params for changes and add items to the database
  useEffect(() => {
    if (route.params?.text) {
      const newNote = {
        title: route.params.text,
        done: false,
        // id: notes.length.toString(),
        id: Date.now().toString(),
      };
      firebase
        .firestore()
        .collection('todos')
        .add(newNote)
        .then(function (docRef) {
          console.log(
            '@useEffect_params_text Document written with ID: ',
            docRef.id
          );
        });
      setNotes([...notes, newNote]);

      // firebase.firestore().collection('todos').orderBy('id');

      console.log('@useEffect_params_text', notes);
    }
  }, [route.params?.text]);

  function addNote() {
    navigation.navigate('Add Screen');
  }

  // This deletes an individual note
  function deleteNote(id, item) {
    // console.log('item', item);
    // console.log('item.id:', id);
    // console.log('Going to delete :' + id);

    firebase
      .firestore()
      .collection('todos')
      .where('id', '==', item.id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log('@deleteNote:', doc.id, ' => ', doc.data());
          firebase.firestore().collection('todos').doc(doc.id).delete();
        });
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });

    // To delete that item, we filter out the item we don't want
    // setNotes(notes.filter((item) => item.id !== id));
    // firebase
    //   .firestore()
    //   .collection('todos')
    //   .doc('hnw7YPSOC9BvZJ1Oi8gq')
    //   .delete();
  }

  function showNoteId(id) {
    console.log('@showNoteId: ', id);
  }

  // The function to render each row in our FlatList
  function renderItem({ item }) {
    console.log('@renderItem', item);

    return (
      <View
        style={{
          padding: 10,
          paddingTop: 20,
          paddingBottom: 20,
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity onPress={() => showNoteId(item.id)}>
          <Text>{item.title}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteNote(item.id, item)}>
          <Ionicons name='trash' size={16} color='#944' />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={renderItem}
        style={{ width: '100%' }}
        keyExtractor={(item) => item.id}
      />
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
});
