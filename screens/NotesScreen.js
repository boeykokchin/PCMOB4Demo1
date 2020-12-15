import React, { useEffect, useState } from 'react';
import firebase from '../database/firebaseDB';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function NotesScreen({ navigation, route }) {
  const [notes, setNotes] = useState([]);

  // This is to set up the top right button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addNote}>
          <MaterialCommunityIcons
            name='plus-circle'
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
      .orderBy('done', 'asc')
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

      console.log('@useEffect_params_text', notes);
    }
  }, [route.params?.text]);

  useEffect(() => {
    if ((route.params?.editText, route.params?.key)) {
      console.log('@useEffect_params_editText', route.params?.editText);
      console.log('@useEffect_params_editText', route.params?.id);

      firebase
        .firestore()
        .collection('todos')
        .where('id', '==', route.params?.key)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log('@editNote: ', doc.id, ' => ', doc.data());
            firebase
              .firestore()
              .collection('todos')
              .doc(doc.id)
              .update({ title: `${route.params?.editText}` });
          });
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error);
        });
    }
  }, [route.params?.editText, route.params?.key]);

  function addNote() {
    navigation.navigate('Add Screen');
  }

  const editItem = (item) => {
    navigation.navigate('Edit Screen', {
      id: item.id,
      title: item.title,
    });
  };

  function doneItem(id) {
    console.log('@doneItem: ', id);

    firebase
      .firestore()
      .collection('todos')
      .where('id', '==', id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log('@doneItem:', doc.id, ' => ', doc.data());
          firebase
            .firestore()
            .collection('todos')
            .doc(doc.id)
            .update({ done: true });
        });
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  }

  // This deletes an individual note
  function deleteNote(id) {
    // console.log('item', item);
    // console.log('item.id:', id);
    // console.log('Going to delete :' + id);

    firebase
      .firestore()
      .collection('todos')
      .where('id', '==', id)
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

    let textStrikeDone = item.done === true ? 'line-through' : 'none';

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
          <Text
            style={{
              textDecorationLine: `${textStrikeDone}`,
              textDecorationStyle: 'solid',
              textTransform: 'uppercase',
            }}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => editItem(item)}
          >
            <MaterialCommunityIcons
              name='circle-edit-outline'
              size={22}
              color='#944'
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => doneItem(item.id)}
          >
            <MaterialCommunityIcons name='check-bold' size={22} color='#944' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteNote(item.id)}>
            <MaterialCommunityIcons name='delete' size={22} color='#944' />
          </TouchableOpacity>
        </View>
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
