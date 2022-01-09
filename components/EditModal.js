import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View, Button} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-date-picker';
import SelectDropdown from 'react-native-select-dropdown';
const addTask = (
  name,
  description,
  priority,
  deadLineDate,
  showDate,
  taskList,
  setTaskList,
  storeTasks,
) => {
  if (name === '') {
    name = 'Задача';
  }
  if (description === '') {
    description = 'Описание';
  }
  let num = Math.random().toString(36).substr(2, 9);
  let taskListClone = [...taskList];
  taskListClone.push({
    Num: num,
    Name: name,
    Description: description,
    PriorityLevel: priority,
    DeadLineDate: deadLineDate,
    CompletionDate: deadLineDate,
    ShowDate: showDate,
    IsCompleted: false,
  });
  storeTasks(taskListClone);
  setTaskList(taskListClone);
};
const editTask = (item, newItem, taskList, setTaskList, storeTasks) => {
  let taskListClone = [...taskList];
  let index = taskList.indexOf(item);
  taskListClone[index] = newItem;
  storeTasks(taskListClone);
  setTaskList(taskListClone);
};

export default function EditModal({
  modalVisible,
  setModalVisible,
  taskList,
  setTaskList,
  editMode,
  setEditMode,
  editedItem,
  storeTasks,
}) {
  const [date, setDate] = useState(() => {
    if (editMode) {
      return new Date(editedItem.DeadLineDate);
    } else {
      return new Date();
    }
  });
  const [open, setOpen] = useState(false);
  const [priority, setPriority] = useState(() => {
    if (editMode) {
      return editedItem.PriorityLevel;
    } else {
      return 1;
    }
  });
  const [taskName, setTaskName] = useState(() => {
    if (editMode) {
      return editedItem.Name;
    } else {
      return '';
    }
  });
  const [taskDescription, setTaskDescription] = useState(() => {
    if (editMode) {
      return editedItem.Description;
    } else {
      return '';
    }
  });
  const [showDate, setShowDate] = useState(() => {
    if (editMode) {
      return editedItem.ShowDate;
    } else {
      return true;
    }
  });
  const topText = editMode => {
    if (editMode) {
      return 'Редактирование задачи';
    } else {
      return 'Добавление задачи';
    }
  };
  return (
    <View style={styles.editContainer}>
      <View style={styles.editDialog}>
        <Text style={styles.text}>{topText(editMode)}</Text>
        <TextInput
          style={styles.input}
          placeholder="Название"
          onChangeText={setTaskName}
          value={taskName}
        />
        <TextInput
          style={styles.descInput}
          multiline={true}
          placeholder="Описание"
          onChangeText={setTaskDescription}
          value={taskDescription}
        />
        <SelectDropdown
          defaultButtonText={'Приоритет'}
          data={['Низкий', 'Средний', 'Высокий']}
          onSelect={(selectedItem, index) => {
            setPriority(index + 1);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
        />
        <View style={styles.buttonStyle}>
          <Button
            title="Выбрать срок выполнения"
            onPress={() => setOpen(true)}
          />
        </View>
        <View style={styles.checkBox}>
          <CheckBox value={showDate} onValueChange={setShowDate} />
          <Text style={styles.checkBoxText}>Со сроком</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.buttonStyle}>
            <Button
              title="Сохранить"
              onPress={() => {
                if (editMode) {
                  editTask(
                    editedItem,
                    {
                      Num: editedItem.Num,
                      Name: taskName,
                      Description: taskDescription,
                      PriorityLevel: priority,
                      DeadLineDate: date,
                      CompletionDate: editedItem.CompletionDate,
                      ShowDate: showDate,
                      IsCompleted: editedItem.IsCompleted,
                    },
                    taskList,
                    setTaskList,
                    storeTasks,
                  );
                } else {
                  addTask(
                    taskName,
                    taskDescription,
                    priority,
                    date,
                    showDate,
                    taskList,
                    setTaskList,
                    storeTasks,
                  );
                }
                setModalVisible(!modalVisible);
                setEditMode(false);
              }}
            />
          </View>
          <View style={styles.buttonStyle}>
            <Button
              title="Закрыть"
              onPress={() => {
                setModalVisible(!modalVisible);
                setEditMode(false);
              }}
            />
          </View>
        </View>
        <DatePicker
          modal
          open={open}
          date={date}
          mode={'date'}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  editContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editDialog: {
    width: '80%',
    backgroundColor: 'white',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    width: '100%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  descInput: {
    height: 100,
    width: '100%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    lineHeight: 10,
    textAlignVertical: 'top',
  },
  buttonStyle: {
    marginTop: 15,
    padding: 5,
  },
  bottomRow: {
    flexDirection: 'row',
  },
  checkBox: {
    flexDirection: 'row',
  },
  checkBoxText: {
    marginTop: 6,
  },
});
