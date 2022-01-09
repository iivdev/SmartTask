import React from 'react';
import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
export default function Header({onPress, setFilterBy}) {
  return (
    <View style={styles.header}>
      <SelectDropdown
        buttonStyle={styles.dropdown}
        buttonTextStyle={styles.dropdownText}
        rowTextStyle={styles.dropdownText}
        defaultButtonText={'Все'}
        data={['Все', 'Низкий', 'Средний', 'Высокий']}
        onSelect={(selectedItem, index) => {
          setFilterBy(index);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
      />
      <Text style={styles.text}>Список задач</Text>
      <Pressable onPress={onPress}>
        <Image source={require('./icons/edit.png')} style={styles.icon} />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    flex: 0,
    width: '100%',
    height: 50,
    backgroundColor: '#A3AEB6',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: 'bold',
  },
  icon: {
    marginTop: 10,
    marginRight: 15,
    marginLeft: 55,
    width: 30,
    height: 30,
  },
  dropdown: {
    backgroundColor: '#A3AEB6',
    width: 100,
    borderWidth: 1,
  },
  dropdownText: {
    fontSize: 14,
  },
});
