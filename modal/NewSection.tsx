import { useState, useEffect } from 'react';
import { Platform, Dimensions, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { container,colors } from '../styles';
import uuid from 'react-native-uuid';
import Modal from 'react-native-modal';
import { Feather } from '@expo/vector-icons';

const width = Dimensions.get('window').width;

function NewSection({db, sections, setSections, track, newSectionVisible, setNewSectionVisible}) {
    const {control, handleSubmit, reset} = useForm();
    const [value, setValue] = useState('');

    const addSection = async (data) => {
        let existingsections = [...sections]; 
            db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO sections (id,section, track) VALUES (?,?, ?)',
                  [ uuid.v4(),data.name, track],
                  (txtObj, stateResultSet) => {
                    const newState = {
                      id: uuid.v4(),
                      section: data.name,
                      track: track,
                    };
                    existingsections.push(newState);
                    setSections(existingsections); 
                  }
                );
            });
        setNewSectionVisible(false);
        reset();
    };

  return (
    <Modal
      isVisible={newSectionVisible}
      onBackdropPress={() => {
        setNewSectionVisible(false);
        setValue('');
      }}
      backdropColor='white'
      avoidKeyboard={true}
      style={{margin: 0,justifyContent:'flex-end',alignItems:'center', width:width}}
    > 
      <TouchableOpacity onPressOut={() => {setValue('');setNewSectionVisible(false);}} activeOpacity={1}>
        <TouchableWithoutFeedback>
            <View style={[container.newModal,{flexDirection:'row',alignItems:'flex-start', justifyContent:'center'}]}>
               <Controller
                control= {control}
                name={'name'}
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                  <View style={{flexDirection:'column'}}>
                    <TextInput
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize = {"characters"}
                        onBlur={onBlur}
                        placeholder={"new section name"}
                        style={[container.textinput,{borderColor: error ? 'red' : '#e8e8e8'}]}
                    />
                    {error && (
                        <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                    )}
                  </View>
                )}
                rules={{
                    required: 'Input a section name',
                    minLength: {
                    value: 3,
                    message: 'Task should be at least 3 characters long',
                    },
                    maxLength: {
                    value: 32,
                    message: 'Task should be max 32 characters long',
                    },
                    validate: (name) => {
                    if (name.includes('  ')) {
                        return 'Name should not contain consecutive spaces';
                    }
                    return true;
                    }
                }}
                />
                <Pressable onPress={handleSubmit(addSection)} style={{justifyContent:'center',height:40, flex:1, alignItems:'center'}}>
                  <Feather name='plus-circle' size={20} color={colors.primary.purple}/>
                </Pressable>
            </View>  
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewSection;
