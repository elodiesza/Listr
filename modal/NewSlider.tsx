import React from 'react';
import { Dimensions, TouchableWithoutFeedback,TouchableOpacity, TextInput, Pressable, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { container, colors} from '../styles';
import uuid from 'react-native-uuid';
import Modal from 'react-native-modal';
import { Feather,Ionicons } from '@expo/vector-icons';

const width = Dimensions.get('window').width;

function NewSlider({addModalVisible, setAddModalVisible, db, sliders, setSliders, section, track}) {
  
  const {control, handleSubmit, reset} = useForm();


  const addSlider = async (data) => {
    let existingsliders = [...sliders]; 
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO sliders (id, name, track, section, sliders, rate) values (?,?,?,?,?,?)',[ uuid.v4(),data.name, track, section, 0,0],
          (txtObj,resultSet)=> {    
            existingsliders.push({ id: uuid.v4(), name: data.name, track: track, section: section, sliders: 0, rate: 0});
            setSliders(existingsliders);
          },
          (txtObj, error) => console.warn('Error inserting data:', error)
          );
        });
    setAddModalVisible(false);
    reset();
  };



  return (
    <Modal
      isVisible={addModalVisible}
      onBackdropPress={() => {
        setAddModalVisible(!addModalVisible);
      }}
      backdropColor='white'
      avoidKeyboard={true}
      style={{margin: 0,justifyContent:'flex-end',alignItems:'center', width:width}}
    > 
      <TouchableOpacity onPressOut={() => {
        setAddModalVisible(!addModalVisible);
        }} 
        activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={[container.newModal,{padding:5}]}>
            <Text>Add a new sliders bar to {section}</Text>
            <View style={{flexDirection:'row'}}>
              <Controller
                control= {control}
                name="name"
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                  <View style={{flexDirection:'column'}}>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder=""
                      style={[container.textinput,{height:40, borderColor: error ? 'red' : '#e8e8e8'}]}
                    />
                    {error && (
                      <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                    )}
                  </View>
                )}
                rules={{
                  required: 'Input a name for your sliders bar',
                  minLength: {
                    value: 3,
                    message: 'Task should be at least 3 characters long',
                  },
                  maxLength: {
                    value: 36,
                    message: 'Task should be max 70 characters long',
                  },
                }}
              />
              <Pressable onPress={handleSubmit(addSlider)} style={{backgroundColor: colors.primary.purple, justifyContent:'center',height:40, width:40, alignItems:'center'}}>
                <Ionicons name='send' size={18} color={colors.primary.white}/>
              </Pressable>
            </View>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewSlider;

