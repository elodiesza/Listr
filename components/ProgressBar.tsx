import { Text, View, TextInput, Dimensions, Pressable} from 'react-native';
import { useState } from 'react';
import { colors, container} from '../styles';
import Slider from '@react-native-community/slider';
import { useForm, Controller, set } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

const width = Dimensions.get('window').width;

function slidersBar({db, name, sliders, setSliders, value, id, color, editIndex, setEditIndex, index, section, selectedSection, setSelectedSection}) {

  const [newsliders, setNewsliders] = useState(value);
  const [nameClicked, setNameClicked] = useState(false);
  const {control, handleSubmit, reset} = useForm();
  const [slidersInput, setSlidersInput] = useState(name);

  const updatesliders = (id) => {
    let existingsliders=[...sliders];
    const indexToUpdate = existingsliders.findIndex(c => c.id === id);
      db.transaction(tx=> {
        tx.executeSql('UPDATE sliders SET sliders = ? WHERE id = ?', [newsliders, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingsliders[indexToUpdate].sliders = newsliders;
              setSliders(existingsliders);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
  };

  const editsliders = (data) => { 
    let existingsliders=[...sliders];
    const indexToUpdate = existingsliders.findIndex(c => c.id === id);
      db.transaction(tx=> {
        tx.executeSql('UPDATE sliders SET name = ? WHERE id = ?', [slidersInput, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingsliders[indexToUpdate].name = slidersInput;
              setSliders(existingsliders);
            }
          },
          (txObj, error) => console.log('Error updating sliders', error)
        );
      });
      setEditIndex(-1);
      setSlidersInput('');
  };

  return (
    <View style={container.taskcontainer}>
        <Pressable onPress={()=>setNameClicked(!nameClicked)} onLongPress={()=>{setEditIndex(index);setSelectedSection(section);}} style={{flex:nameClicked?3/4:1/4,justifyContent:'center', display: (editIndex==index && selectedSection==section)?'none':'flex'}}>
          <Text style={{textAlign:'left'}}>{name}</Text>
        </Pressable>
        {editIndex==index && selectedSection==section &&
          <Pressable style={{flex:1, flexDirection:'row', alignItems:'center'}}>   
            <Controller
                  control= {control}
                  name="sliders"
                  render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                    <View style={{flexDirection:'column', flex:1}}>
                      <TextInput
                        value={slidersInput}
                        onChangeText={(val)=>setSlidersInput(val)}
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
                    required: 'Input a sliders',
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
            <Pressable onPress={editsliders} style={{height:40, width:60, justifyContent:'center', alignItems:'center',backgroundColor:colors.primary.purple}}>
              <Ionicons name='send' size={20} color={colors.primary.white}/>
            </Pressable>
          </Pressable>
        }
        <View style={{flex: nameClicked? 1/4:3/4, alignItems:'center', justifyContent:'center'}}>
          <View style={{flex:1,borderWidth:1,borderRadius:10,position:'absolute', alignItems:'flex-start', justifyContent:'center', width:'95%', backgroundColor:colors.primary.white, height:30}}>
            <View style={{position:'absolute',borderRadius:10, width:value+'%', backgroundColor:color, height:28}}/>
          </View>
          <Slider
            style={{width: '96%', height: 40}}
            value={value}
            onValueChange={(value) => {setNewsliders(value);updatesliders(id);}}
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
export default slidersBar;

