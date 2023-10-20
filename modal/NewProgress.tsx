import React, { useState, useEffect } from 'react';
import { Dimensions, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { container, colors} from '../styles';
import uuid from 'react-native-uuid';
import Modal from 'react-native-modal';
import { Feather } from '@expo/vector-icons';

const width = Dimensions.get('window').width;

function NewProgress({addModalVisible, setAddModalVisible, db, progress, setProgress, section, track}) {
  
  const {control, handleSubmit, reset} = useForm();


  const addProgress = async (data) => {
    let existingProgress = [...progress]; 
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO progress (id, name, track, list, progress, rate) values (?,?,?,?,?,?)',[ uuid.v4(),data.name, track, section, 0,0],
          (txtObj,resultSet)=> {    
            existingProgress.push({ id: uuid.v4(), name: data.name, track: track, list: section, progress: 0, rate: 0});
            setProgress(existingProgress);
          },
          (txtObj, error) => console.warn('Error inserting data:', error)
          );
        });
    setAddModalVisible(false);
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
            <Text>Add a new progress bar to {section}</Text>
            <View style={{flexDirection:'row'}}>
              <Controller
                control= {control}
                name="name"
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                  <>
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
                  </>
                )}
                rules={{
                  required: 'Input a name for your progress bar',
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
              <Pressable onPress={handleSubmit(addProgress)} style={{justifyContent:'center',height:40, flex:1, alignItems:'center'}}>
                <Feather name='plus-circle' color={colors.primary.purple} size={20}/>
              </Pressable>
            </View>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewProgress;

