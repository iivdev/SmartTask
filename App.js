/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {StyleSheet, Modal, SafeAreaView, View, FlatList} from 'react-native';
import {AsyncStorage} from 'react-native';
import Header from './components/Header.js';
import ItemBox from './components/ItemBox';
import EditModal from './components/EditModal';

const storeTasks = async taskList => {
  try {
    const jsonValue = JSON.stringify(taskList);
    await AsyncStorage.setItem('taskList', jsonValue);
  } catch (e) {
    console.log(e);
  }
};
const fetchTasks = async setTasks => {
  try {
    const jsonValue = await AsyncStorage.getItem('taskList');
    setTasks(jsonValue != null ? JSON.parse(jsonValue) : []);
  } catch (e) {
    console.log(e);
  }
  return [];
};
export default function App() {
  const [firstRender, setFirstRender] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [filterBy, setFilterBy] = useState(0);
  const [editedItem, setEditedItem] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [taskList, setTaskList] = useState([]);
  if (firstRender) {
    fetchTasks(setTaskList).then(console.log('Данные получены'));
    setFirstRender(false);
  }
  return (
    <SafeAreaView style={styles.container}>
      <Header onPress={() => setModalVisible(true)} setFilterBy={setFilterBy} />
      <View style={styles.list}>
        <FlatList
          data={taskList}
          renderItem={({item}) => (
            <ItemBox
              item={item}
              taskList={taskList}
              setTaskList={setTaskList}
              setEditMode={setEditMode}
              setModalOpen={setModalVisible}
              setEditedItem={setEditedItem}
              filterBy={filterBy}
              storeTasks={storeTasks}
            />
          )}
        />
      </View>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <EditModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          taskList={taskList}
          setTaskList={setTaskList}
          editMode={editMode}
          setEditMode={setEditMode}
          editedItem={editedItem}
          storeTasks={storeTasks}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  list: {
    flex: 1,
    width: '100%',
  },
});
