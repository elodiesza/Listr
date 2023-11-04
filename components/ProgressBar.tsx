import { Text, View, TextInput, Dimensions, Pressable} from 'react-native';
import { useState } from 'react';
import { colors} from '../styles';
import Slider from '@react-native-community/slider';
import { useForm, Controller, set } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

const width = Dimensions.get('window').width;

function ProgressBar({db, name, progress, setProgress, value, id, color, editIndex, setEditIndex, index, section, selectedSection, setSelectedSection}) {

  const [newProgress, setNewProgress] = useState(value);
  const [nameClicked, setNameClicked] = useState(false);
  const {control, handleSubmit, reset} = useForm();
  const [progressInput, setProgressInput] = useState(name);

  const updateProgress = (id) => {
    let existingProgress=[...progress];
    const indexToUpdate = existingProgress.findIndex(c => c.id === id);
      db.transaction(tx=> {
        tx.executeSql('UPDATE progress SET progress = ? WHERE id = ?', [newProgress, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingProgress[indexToUpdate].progress = newProgress;
              setProgress(existingProgress);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
  };

  const editProgress = (data) => { 
    let existingProgress=[...progress];
    const indexToUpdate = existingProgress.findIndex(c => c.id === id);
      db.transaction(tx=> {
        tx.executeSql('UPDATE progress SET name = ? WHERE id = ?', [progressInput, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingProgress[indexToUpdate].task = progressInput;
              setProgress(existingProgress);
            }
          },
          (txObj, error) => console.log('Error updating progress', error)
        );
      });
      setEditIndex(-1);
  };

  return (
    <View style={{flexDirection:'row',backgroundColor:colors.primary.white,width:width*0.9, height:40,flex:1}}>
        <Pressable onLongPress={()=>{setNameClicked(!nameClicked);setEditIndex(index);setSelectedSection(section);}} style={{flex:nameClicked?3/4:1/4,justifyContent:'center', marginLeft:10, display: (editIndex==index && selectedSection==section)?'none':'flex'}}>
          <Text style={{textAlign:'left'}}>{name}</Text>
        </Pressable>
        {editIndex==index && selectedSection==section &&
          <Pressable style={{flex:1, flexDirection:'row', alignItems:'center'}}>   
            <Controller
                  control= {control}
                  name="progress"
                  render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                    <View style={{flexDirection:'column', flex:1}}>
                      <TextInput
                        value={progressInput}
                        onChangeText={(val)=>setProgressInput(val)}
                        onBlur={onBlur}
                        placeholder={name}
                        style={{borderColor: error ? 'red' : '#e8e8e8',height:50,flex:1}}
                      />
                      {error && (
                        <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                      )}
                    </View>
                  )}
                  rules={{
                    required: 'Input a progress',
                    minLength: {
                      value: 3,
                      message: 'Task should be at least 3 characters long',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Task should be max 50 characters long',
                    },
                  }}
            />
            <Pressable onPress={editProgress} style={{height:40, width:60, justifyContent:'center', alignItems:'center',backgroundColor:colors.primary.purple}}>
              <Ionicons name='send' size={20} color={colors.primary.white}/>
            </Pressable>
          </Pressable>
        }
        <View style={{flex: nameClicked? 1/4:3/4, alignItems:'center', justifyContent:'center'}}>
          <View style={{flex:1,borderWidth:1,borderRadius:10,position:'absolute', alignItems:'flex-start', justifyContent:'center', width:'90%', backgroundColor:colors.primary.white, height:30}}>
            <View style={{position:'absolute',borderRadius:10, width:value+'%', backgroundColor:color, height:28}}/>
          </View>
          <Slider
            style={{width: '91%', height: 40}}
            value={value}
            onValueChange={(value) => {setNewProgress(value);updateProgress(id);}}
            step={1}
            thumbTintColor={'transparent'}
            minimumValue={0}
            maximumValue={101}
            minimumTrackTintColor={'transparent'}
            maximumTrackTintColor={'transparent'}
          />
        </View>
    </View>
  );
}
export default ProgressBar;

