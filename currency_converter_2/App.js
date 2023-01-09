import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import React, { useState, Component } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {convertCurrency} from './CurrencyConverter';
import {Currency, dropDownValues} from './CurrencyEnum';
var responseText = '';

async function handleClick(amount, currencyType) {
  try {
    var convertedAmount = await convertCurrency(amount, currencyType);
    var responseText = "Your converted amount is " + convertedAmount;
  } catch(error) {
    console.error("caught error: ", error.errorMessage);
    responseText = error.errorMessage;
  }
  console.log("responseText: ", responseText);
  // My (failed) attempt to display the success/fail message on the UI
  return(
    <Text>{responseText}</Text>
  ); 
}

export default function App() {
  
  const [text, setText] = useState('');

  const [items, setItems] = useState(dropDownValues);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(value);
  const [responseText, setResponseText] = useState('');
  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' />
    <Text style={styles.titleText}>
      {"Currency Converter"}
    </Text>
    <View style={{padding: 22, borderRadius: 15, backgroundColor: "white", width: 300, marginBottom: 10}}>
      <TextInput
            placeholder="Enter amount here in CZK"
            onChangeText={newText => setText(newText)}
            keyboardType="numeric"
            defaultValue={text}
          />
    </View>
    <View style={{padding: 15, borderRadius: 15, backgroundColor: "white", width: 300, marginBottom: 10}}>
      <DropDownPicker
        open={open}
        placeholder='Select currency'
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        containerStyle={{height: 40}}
        onChangeValue={newVal => setValue(newVal)}
      />
    </View>
      <Button
        onPress={() => handleClick(text, value)}
        title="Submit"
        color="#841584"
        accessibilityLabel="Click to get the converted amount"
        alignItems="right"
        marginBottom="100"
      />
    </View>
  );};

  const styles = StyleSheet.create({
    titleText: {
      fontSize: 33,
      fontWeight: "bold",
      color: "white",
      position: 'absolute', 
      top: 200,
    },
    container: {
      flex: 1,
      backgroundColor: '#336EFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

