import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const Calculator = () => {
  const [rate, setRate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalRate, setTotalRate] = useState('');
  const [width, setWidth] = useState('');
  const [thick, setThick] = useState('');
  const [length, setLength] = useState('');
  const [wood, setWood] = useState('Select Wood');
  const [unit, setUnit] = useState('Select Unit');
  const [volumeOfUnit, setVolumeOfUnit] = useState('');
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  useEffect(() => {
    calculateTotalRate();
  }, [rate, volumeOfUnit]);

  useEffect(() => {
    calculateVolumeOfUnit();
  }, [width, thick, length, unit, quantity]);

  const calculateTotalRate = () => {
    const rateValue = parseFloat(rate);
    const volumeValue = parseFloat(volumeOfUnit);
    if (!isNaN(rateValue) && !isNaN(volumeValue)) {
      const total = rateValue * volumeValue;
      setTotalRate(Number.isInteger(total) ? total.toFixed(0) : total.toFixed(2));
    } else {
      setTotalRate('');
    }
  };

  const handleRateChange = (value) => {
    setRate(value);
  };

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  const handleWidthChange = (value) => {
    setWidth(value);
  };

  const handleThickChange = (value) => {
    setThick(value);
  };

  const handleLengthChange = (value) => {
    setLength(value);
  };

  const handleWoodChange = (value) => {
    setWood(value);
  };

  const handleUnitChange = (value) => {
    setUnit(value);
    if (value === 'Rcft') {
      setThick('');
    }
  };

  const calculateVolumeOfUnit = () => {
    const widthValue = parseFloat(width);
    const lengthValue = parseFloat(length);
    const quantityValue = parseFloat(quantity);

    if (!isNaN(widthValue) && !isNaN(lengthValue) && !isNaN(quantityValue)) {
      let volume = 0;
      if (unit === 'Sft') {
        volume = ((widthValue * thick * lengthValue) / 12) * quantityValue;
      } else if (unit === 'Cft') {
        volume = ((widthValue * thick * lengthValue) / 144) * quantityValue;
      } else if (unit === 'Rcft') {
        volume = ((widthValue * widthValue * lengthValue) / 2304) * quantityValue;
      }

      if (Number.isInteger(volume)) {
        setVolumeOfUnit(volume.toFixed(0));
      } else {
        setVolumeOfUnit(volume.toFixed(2));
      }
    } else {
      setVolumeOfUnit('');
    }
  };

  const handleAddToInvoice = () => {
    const newItem = {
      woodType: wood,
      width,
      thick,
      length,
      unit,
      volumeOfUnit,
      rate,
      quantity,
      totalRate,
    };
    setInvoiceItems([...invoiceItems, newItem]);
    clearInputs();
  };

  const clearInputs = () => {
    setWood('');
    setWidth('');
    setThick('');
    setLength('');
    setUnit('');
    setVolumeOfUnit('');
    setRate('');
    setQuantity('');
    setTotalRate('');
  };

  const handleMoreOptions = (item) => {
    setEditedItem(item);
    setModalVisible(true);
  };

  const handleEditItem = () => {
    const updatedItems = invoiceItems.map((item, index) => {
      if (item === editedItem) {
        return {
          ...item,
          woodType: editedItem.woodType,
          width: editedItem.width,
          thick: editedItem.thick,
          length: editedItem.length,
          unit: editedItem.unit,
          volumeOfUnit: editedItem.volumeOfUnit,
          rate: editedItem.rate,
          quantity: editedItem.quantity,
          totalRate: editedItem.totalRate,
        };
      }
      return item;
    });
    setInvoiceItems(updatedItems);
    setModalVisible(false);
    setEditedItem(null); // Reset editedItem state after updating the invoice
  };
  

  const handleDeleteItem = () => {
    const updatedItems = invoiceItems.filter((item) => item !== editedItem);
    setInvoiceItems(updatedItems);
    setModalVisible(false);
    setEditedItem(null); // Reset editedItem state after deleting from the invoice
  };


  const handleEditInputChange = (key, value) => {
    setEditedItem({
      ...editedItem,
      [key]: value,
    });
  };

//   console.log("Invoice Items:", invoiceItems); // Check if invoiceItems has values

  const navigation = useNavigation(); // Initialize navigation


  const handleGenerateInvoice = () => {
    
    navigation.navigate('Invoice', { items: invoiceItems });
  };

  if (invoiceGenerated) {
    return (
      <View style={styles.container}>
        <Invoice items={invoiceItems} />
      </View>
    );
  }


  return (
<ScrollView contentContainerStyle={styles.scrollViewContent}>
  <View style={styles.container}>
    {/* <Text style={styles.title}>Wood Calculator</Text> */}

    <View style={styles.inputContainer}>
      <View style={styles.inputColumn}>
        <Text style={styles.label}>Wood</Text>
        <Picker
          style={styles.dropdown}
          selectedValue={wood}
          onValueChange={(value) => handleWoodChange(value)}
        >
            <Picker.Item label="Select Wood"/>
            <Picker.Item label="Teak" value="Teak" />
            <Picker.Item label="Neem" value="Neem" />
            <Picker.Item label="Mahogany" value="Mahogany" />
            <Picker.Item label="Portia" value="Portia" />
            <Picker.Item label="Acacia" value="Acacia" />
            <Picker.Item label="Mango" value="Mango" />
            <Picker.Item label="Jack" value="Jack" />
            <Picker.Item label="Sddachi" value="Sddachi" />
            <Picker.Item label="Venthekku" value="Venthekku" />
        </Picker>
      </View>

      <View style={styles.inputColumn}>
        <Text style={styles.label}>Width/R</Text>
        <TextInput
          style={styles.calinput}
          placeholder="inch"
          keyboardType="numeric"
          value={width}
          onChangeText={handleWidthChange}
          onBlur={calculateVolumeOfUnit}
        />
      </View>

      {unit !== 'Rcft' && (
        <View style={styles.inputColumn}>
          <Text style={styles.label}>Thick</Text>
          <TextInput
            style={styles.calinput}
            placeholder="inch"
            keyboardType="numeric"
            value={thick}
            onChangeText={handleThickChange}
            onBlur={calculateVolumeOfUnit}
          />
        </View>
      )}

      <View style={styles.inputColumn}>
        <Text style={styles.label}>Length</Text>
        <TextInput
          style={styles.calinput}
          placeholder="feet"
          keyboardType="numeric"
          value={length}
          onChangeText={handleLengthChange}
          onBlur={calculateVolumeOfUnit}
        />
      </View>

      <View style={styles.inputColumn}>
        <Text style={styles.label}>Qty</Text>
        <TextInput
          style={styles.calinput}
          placeholder="Qty"
          keyboardType="numeric"
          value={quantity}
          onChangeText={handleQuantityChange}
          onBlur={calculateVolumeOfUnit}
        />
      </View>

      <View style={styles.inputColumn}>
        <Text style={styles.label}>Unit</Text>
        <Picker
          style={styles.dropdown}
          selectedValue={unit}
          onValueChange={(value) => handleUnitChange(value)}
        >
          <Picker.Item label="Select Units"/>
          <Picker.Item label="Cft" value="Cft" />
          <Picker.Item label="Sft" value="Sft" />
          <Picker.Item label="Rcft" value="Rcft" />
        </Picker>
      </View>

      <View style={styles.inputColumn}>
        <Text style={styles.label}>Vol</Text>
        <TextInput
          style={styles.calinput}
          placeholder="Volume"
          keyboardType="numeric"
          value={volumeOfUnit}
          editable={false}
        />
      </View>

      <View style={styles.inputColumn}>
        <Text style={styles.label}>Rate</Text>
        <TextInput
          style={styles.calinput}
          placeholder="Rate"
          keyboardType="numeric"
          value={rate}
          onChangeText={handleRateChange}
        />
      </View>

      <View style={styles.inputColumn}>
        <Text style={styles.label}>Total</Text>
        <TextInput
          style={styles.calinput}
          placeholder="Total"
          keyboardType="numeric"
          value={totalRate}
          editable={false}
        />
      </View>
    </View>

    <TouchableOpacity onPress={handleAddToInvoice} style={styles.addButton}>
      <Text style={styles.addButtonText}>Add to Invoice</Text>
    </TouchableOpacity>

    <View style={styles.invoiceList}>
      <View style={styles.invoiceItem}>
        <Text style={styles.labelhead}>Wood</Text>
        <Text style={styles.labelhead}>Width</Text>
        {unit !== 'Rcft' && <Text style={styles.labelhead}>Thick</Text>}
        <Text style={styles.labelhead}>Length</Text>
        <Text style={styles.labelhead}>Qty</Text>
        <Text style={styles.labelhead}>Unit</Text>
        <Text style={styles.labelhead}>Vol</Text>
        <Text style={styles.labelhead}>Rate</Text>
        <Text style={styles.labelhead}>Total Rate</Text>
      </View>
      {invoiceItems.map((item, index) => (
        <View key={index} style={styles.invoiceItem}>
          <Text>{item.woodType}</Text>
          <Text>{item.width}</Text>
          {unit !== 'Rcft' && <Text>{item.thick}</Text>}
          <Text>{item.length}</Text>
          <Text>{item.quantity}</Text>
          <Text>{item.unit}</Text>
          <Text>{item.volumeOfUnit}</Text>
          <Text>{item.rate}</Text>
          <Text>{item.totalRate}</Text>
          <TouchableOpacity onPress={() => handleMoreOptions(item)}>
            <Image
              source={{
                uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAYFBMVEX///8AAACUlJRYWFjz8/Ozs7P29vbu7u77+/vLy8u2traEhIRtbW3a2tp/f39ISEgICAguLi68vLwUFBQfHx+fn59TU1OKioqpqak3NzfDw8NnZ2c9PT10dHTg4OAkJCTpdVGNAAACpUlEQVR4nO2c65KCMAxGCYJYAbkIXlHf/y0XGN11ldLO6CTfj5wHcM5QbJPQJAg+J8rjtGjKsinSOI++8IOfs2x39MSuXUobBUlIb4SJrJMp3p2ICiPp1E4pDbRyTnubE9Ee0EnM6jDnRHSQcMrnnYhyfqfVwiW1WLFLORZPZAFXR7fUkftRndxORCdmqbOP1JnXKel8pDreQ9Br9bjXL/aTilmlJgKWKUJWqY2f1IZVyuvPx/33u/hJXVilZqOWP3jjF2vI+R/eALT2k6pZpfLGx6nhDalWO7dSnwMyhwleuyfv3tmfyD5S7Empx07Fu0sNXG8up9uVXcr9VnG/USOOdGYh4RRcZ3OHo8DijVaV3akScur3dWuk3gmkxw8SS1x1li2bxRNLWPGG5hMk7cvZ3LTC1cWR5Snr7jvprctO8nXYO1Fex4dDXIMUrBVFURRFUWaIzDpMsywN1wYldsk3RfkIO8tiI5gy/GLectKF6GftnmSyznERjdKNJR2tBB9WvZ12ItryVjufnWxKA0JWxvqcxmclsoLJTHljfK8k3nZnfZG/uhgYlxMR/wI6ryUI1PKc9zcGuE8cr6+QvN8gg2jyMtcrBW/MYEq3Uh8z8L7qax8nojWrFOTX9tRPKmWVyvykMpWCXD7IFx1yS4DcPCGPGcgDGTN0gQzyMMNhyMQBM8WCTEYx03bMAgdmKQizaBZAlhcHAAuxA4Ala0VRFEVRFCt4FwUBr1QiXj4FvKaLeKEZ8eo34iV5yHYCxMYLxBYVyGYexLYnyAYxxFY6yKZDyPZMyEZWyJZfyOZoyDZyyIZ7yNEEkF/bIcddQA4GgRyhAjlsBnMsD+QAI8hRT5hDsSDHh2EOWsMcSYc5vA9zzCHmQEjM0ZkB5JDRga+PY/0B8UAmjW88LlQAAAAASUVORK5CYII='
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>

    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Picker
            style={styles.dropdown}
            selectedValue={editedItem ? editedItem.woodType : ''}
            onValueChange={(value) => handleEditInputChange('woodType', value)}
          >
            <Picker.Item label="Teak" value="Teak" />
            <Picker.Item label="Neem" value="Neem" />
            <Picker.Item label="Mahogany" value="Mahogany" />
            <Picker.Item label="Portia" value="Portia" />
            <Picker.Item label="Acacia" value="Acacia" />
            <Picker.Item label="Mango" value="Mango" />
            <Picker.Item label="Jack" value="Jack" />
            <Picker.Item label="Sddachi" value="Sddachi" />
            <Picker.Item label="Venthekku" value="Venthekku" />
          </Picker>
          <TextInput
            style={styles.calinput}
            placeholder="Width"
            keyboardType="numeric"
            value={editedItem ? editedItem.width : ''}
            onChangeText={(value) => handleEditInputChange('width', value)}
          />
          {unit !== 'Rcft' && (
            <TextInput
              style={styles.calinput}
              placeholder="Thick"
              keyboardType="numeric"
              value={editedItem ? editedItem.thick : ''}
              onChangeText={(value) => handleEditInputChange('thick', value)}
            />
          )}
          <TextInput
            style={styles.calinput}
            placeholder="Length"
            keyboardType="numeric"
            value={editedItem ? editedItem.length : ''}
            onChangeText={(value) => handleEditInputChange('length', value)}
          />
          <TextInput
            style={styles.calinput}
            placeholder="Qty"
            keyboardType="numeric"
            value={editedItem ? editedItem.quantity : ''}
            onChangeText={(value) => handleEditInputChange('quantity', value)}
          />
          <Picker
            style={styles.dropdown}
            selectedValue={editedItem ? editedItem.unit : ''}
            onValueChange={(value) => handleEditInputChange('unit', value)}
          >
            <Picker.Item label="Cft" value="Cft" />
            <Picker.Item label="Sft" value="Sft" />
            <Picker.Item label="Rcft" value="Rcft" />
          </Picker>
          <TextInput
            style={styles.calinput}
            placeholder="Volume"
            keyboardType="numeric"
            value={editedItem ? editedItem.volumeOfUnit : ''}
            editable={false}
          />
          <TextInput
            style={styles.calinput}
            placeholder="Rate"
            keyboardType="numeric"
            value={editedItem ? editedItem.rate : ''}
            onChangeText={(value) => handleEditInputChange('rate', value)}
          />
          <TextInput
            style={styles.calinput}
            placeholder="Total Rate"
            keyboardType="numeric"
            value={editedItem ? editedItem.totalRate : ''}
            editable={false}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={handleEditItem} style={[styles.modalButton, styles.saveButton]}>
                <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteItem} style={[styles.modalButton, styles.deleteButton]}>
                <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
            </View>
        </View>
      </View>
    </Modal>

    <TouchableOpacity onPress={handleGenerateInvoice} style={styles.generateButton}>
        <Text style={styles.generateButtonText}>Generate Invoice</Text>
      </TouchableOpacity>
  </View>
  </ScrollView>
);
};

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    inputColumn: {
        width: '50%',
        marginBottom: 10,
    },
    calinput: {
        borderWidth: 1,
        padding: 5,
    },
    label: {
        marginBottom: 5,
    },
    addButton: {
        backgroundColor: '#6717f6',
        borderRadius: 5,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    invoiceList: {
        // marginTop: 20,
    },
    invoiceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    generateButton: {
        backgroundColor: '#6717f6',
        borderRadius: 5,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    generateButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 200,
    },
    editButton: {
        backgroundColor: '#6717f6',
        borderRadius: 5,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    deleteButton: {
        backgroundColor: '#ff4500',
        borderRadius: 5,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    icon: {
        width: 15,
        height: 15,
    },
    labelhead: {
        fontWeight: 'bold',
    },
    dropdown: {
        borderStyle: 'solid', 
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#bdc3c7',
        overflow: 'hidden'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: '#6717f6', // Background color for save button
    },
    deleteButton: {
        backgroundColor: '#ff4500', // Background color for delete button
    },
    modalButtonText: {
        color: '#fff', // Text color for both buttons
        fontSize: 18,
    },
  
});

export default Calculator;
