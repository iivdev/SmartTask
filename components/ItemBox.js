import React, {useState} from 'react';
import Moment from 'moment';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  Image,
  Alert,
} from 'react-native';

const getBackgroundColor = (
  deadLineDate,
  completionDate,
  isCompleted,
  showDate,
) => {
  let currentDate = Date.parse(Date());
  let color = '';
  if (isCompleted) {
    if (Date.parse(completionDate) > Date.parse(deadLineDate)) {
      //Сделано поздно
      color = '#64D1B7';
    } else {
      //Сделано вовремя
      color = '#99EE99';
    }
    //Без даты
    if (!showDate) {
      color = '#99EE99';
    }
  } else {
    if (Date.parse(deadLineDate) > currentDate) {
      //В работе
      color = '#ffdfbf';
    } else {
      //Не сделано вовремя
      color = '#DDDDDD';
    }
    //Без даты
    if (!showDate) {
      color = '#ffdfbf';
    }
  }
  return color;
};
const getCompletionText = (
  deadLineDate,
  completionDate,
  isCompleted,
  showDate,
) => {
  let currentDate = Date.parse(Date());
  let result = '';
  if (isCompleted) {
    if (Date.parse(completionDate) > Date.parse(deadLineDate)) {
      //Сделано поздно
      result = 'Сделано невовремя';
    } else {
      //Сделано вовремя
      result = 'Сделано вовремя';
    }
    //Без даты
    if (!showDate) {
      return 'Сделано';
    }
  } else {
    if (Date.parse(deadLineDate) > currentDate) {
      //В работе
      result = 'В работе';
    } else {
      //Не сделано вовремя
      result = 'Просрочено';
    }
    //Без даты
    if (!showDate) {
      return 'В работе';
    }
  }
  return result;
};
const getPriorityImage = priority => {
  switch (priority) {
    case 1: {
      return require('./icons/lowpriority.png');
    }
    case 2: {
      return require('./icons/midpriority.png');
    }
    case 3: {
      return require('./icons/highpriority.png');
    }
  }
};
const getPriorityText = priority => {
  switch (priority) {
    case 1: {
      return 'Низкий \n Приоритет';
    }
    case 2: {
      return 'Средний \n Приоритет';
    }
    case 3: {
      return 'Высокий \n Приоритет';
    }
  }
};
const deleteItem = (item, taskList, setTaskList, storeTasks) => {
  let index = taskList.indexOf(item);
  let taskListClone = taskList
    .slice(0, index)
    .concat(taskList.slice(index + 1, taskList.length));
  setTaskList(taskListClone);
  storeTasks(taskListClone);
};
const deletionAlert = (item, taskList, setTaskList, storeTasks) =>
  Alert.alert('Удаление задачи', 'Вы точно хотите удалить эту задачу?', [
    {
      text: 'Нет',
      style: 'cancel',
    },
    {
      text: 'Да',
      onPress: () => deleteItem(item, taskList, setTaskList, storeTasks),
    },
  ]);
const submitTask = (item, taskList, setTaskList, submit, storeTasks) => {
  let taskListClone = [...taskList];
  let index = taskList.indexOf(item);
  let currentDate = Date();
  taskListClone[index].IsCompleted = submit;
  taskListClone[index].CompletionDate = Moment(currentDate).format();
  storeTasks(taskListClone);
  setTaskList(taskListClone);
};
export function SubmitButton({item, taskList, setTaskList, storeTasks}) {
  if (!item.IsCompleted) {
    return (
      <Pressable
        style={styles(item).submitButton}
        onPress={() =>
          submitTask(item, taskList, setTaskList, true, storeTasks)
        }>
        <Text style={styles(item).submitText}>Пометить как сделанную</Text>
      </Pressable>
    );
  } else {
    return (
      <Pressable
        style={styles(item).submitButton}
        onPress={() =>
          submitTask(item, taskList, setTaskList, false, storeTasks)
        }>
        <Text style={styles(item).submitText}>Пометить как несделанную</Text>
      </Pressable>
    );
  }
}
const editTaskModal = (item, setEditMode, setModalOpen, setEditedItem) => {
  setEditedItem(item);
  setEditMode(true);
  setModalOpen(true);
};
export default function ItemBox({
  item,
  taskList,
  setTaskList,
  setEditMode,
  setModalOpen,
  setEditedItem,
  filterBy,
  storeTasks,
}) {
  const [itemCollapsed, setItemCollapsed] = useState(true);
  const onPress = () => {
    setItemCollapsed(!itemCollapsed);
  };
  if (!(filterBy === item.PriorityLevel || filterBy === 0)) {
    return <View />;
  }
  if (itemCollapsed) {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={[styles(item).task, styles(item).taskContainer]}>
          <View>
            <Image
              source={getPriorityImage(item.PriorityLevel)}
              style={styles(item).biggerIcon}
            />
          </View>
          <View style={styles(item).midSection}>
            <Text style={styles(item).title}>{item.Name}</Text>
            <Text style={styles(item).description}>
              {'' + item.Description}
            </Text>
          </View>
          <View>
            <Pressable
              onPress={() =>
                deletionAlert(item, taskList, setTaskList, storeTasks)
              }>
              <Image
                source={require('./icons/close.png')}
                style={styles(item).icon}
              />
            </Pressable>
            <Pressable
              onPress={() =>
                editTaskModal(item, setEditMode, setModalOpen, setEditedItem)
              }>
              <Image
                source={require('./icons/edit.png')}
                style={styles(item).icon}
              />
            </Pressable>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles(item).task}>
          <View style={styles(item).taskContainer}>
            <View>
              <Image
                source={getPriorityImage(item.PriorityLevel)}
                style={styles(item).biggerIcon}
              />
              <Text style={styles(item).prioritySubText}>
                {getPriorityText(item.PriorityLevel)}
              </Text>
            </View>
            <View style={styles(item).midSection}>
              <Text style={styles(item).title}>{item.Name}</Text>
              <Text style={styles(item).completionSubText}>
                {getCompletionText(
                  item.DeadLineDate,
                  item.CompletionDate,
                  item.IsCompleted,
                  item.ShowDate,
                )}
              </Text>
              <Text style={styles(item).description}>
                {'' + item.Description}
              </Text>
              <Text style={styles(item).dateTime}>
                {item.ShowDate &&
                  'Сделать до: ' +
                    Moment(item.DeadLineDate).format('DD.MM.YYYY')}
              </Text>
              <Text style={styles(item).dateTime}>
                {item.IsCompleted &&
                  'Завершено: ' +
                    Moment(item.CompletionDate).format('DD.MM.YYYY')}
              </Text>
            </View>
            <View>
              <Pressable
                onPress={() =>
                  deletionAlert(item, taskList, setTaskList, storeTasks)
                }>
                <Image
                  source={require('./icons/close.png')}
                  style={styles(item).icon}
                />
              </Pressable>
              <Pressable
                onPress={() =>
                  editTaskModal(item, setEditMode, setModalOpen, setEditedItem)
                }>
                <Image
                  source={require('./icons/edit.png')}
                  style={styles(item).icon}
                />
              </Pressable>
            </View>
          </View>
          <SubmitButton
            item={item}
            taskList={taskList}
            setTaskList={setTaskList}
            storeTasks={storeTasks}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = item =>
  StyleSheet.create({
    task: {
      flex: 1,
      backgroundColor: getBackgroundColor(
        item.DeadLineDate,
        item.CompletionDate,
        item.IsCompleted,
        item.ShowDate,
      ),
      borderRadius: 10,
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10,
      paddingTop: 10,
      paddingBottom: 10,
    },
    taskContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 18,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    description: {
      fontSize: 14,
      textAlign: 'center',
    },
    dateTime: {
      textAlign: 'right',
    },
    topRow: {
      flex: 1,
      flexDirection: 'row',
    },
    biggerIcon: {
      marginLeft: 10,
      width: 48,
      height: 48,
    },
    icon: {
      marginRight: 10,
      width: 24,
      height: 24,
    },
    midSection: {
      width: '70%',
    },
    prioritySubText: {
      marginLeft: 5,
      fontSize: 12,
      textAlign: 'center',
    },
    completionSubText: {
      color: 'black',
      fontSize: 12,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    submitButton: {
      padding: 5,
      marginLeft: 20,
      marginRight: 20,
      borderWidth: 1,
    },
    submitText: {
      color: '#000000',
      textAlign: 'center',
    },
  });
