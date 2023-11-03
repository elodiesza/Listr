import {  TextInput,Text, View, Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { container, colors} from '../styles';
import { useForm, Controller, set } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

const width = Dimensions.get('window').width;

function Status({db, name, list, statuslist, statusrecords, setStatusrecords, number, id, editIndex, setEditIndex, index}) {


  const [status, setStatus] = useState(statuslist.filter(c=>c.name==list).map(c=>c.item)[number]);
  const [color, setColor] = useState(statuslist.filter(c=>c.name==list).map(c=>c.color)[number]);
  const lastnumber = statuslist.filter(c=>c.name==list).map(c=>c.number).length-1;
  const [newnumber, setNewnumber] = useState(number);
  const {control, handleSubmit, reset} = useForm();
  const [statusInput, setStatusInput] = useState(name);

  useEffect(() => {
    setStatus(statuslist.filter(c=>c.name==list).map(c=>c.item)[newnumber]);
    setColor(statuslist.filter(c=>c.name==list).map(c=>c.color)[newnumber]);
  }, [newnumber]);

  const UpdateStatus = () => {
    let existingrecords=[...statusrecords];
    const indexToUpdate = existingrecords.findIndex(c => c.id === id);
      db.transaction(tx=> {
        tx.executeSql('UPDATE statusrecords SET number = ? WHERE id = ?', [newnumber==lastnumber?0:newnumber+1, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingrecords[indexToUpdate].number = newnumber==lastnumber?0:newnumber+1;
              setStatusrecords(existingrecords);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
  }


  const editStatus = (data) => { 2
    let existingStatus=[...statusrecords];
    const indexToUpdate = existingStatus.findIndex(c => c.id === id);
      db.transaction(tx=> {
        tx.executeSql('UPDATE statusrecords SET name = ? WHERE id = ?', [statusInput, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingStatus[indexToUpdate].task = statusInput;
              setStatusrecords(existingStatus);
            }
          },
          (txObj, error) => console.log('Error updating statusrecords', error)
        );
      });
      setEditIndex(-1);
  };

  return (
    <View style={{flexDirection:'row',backgroundColor:colors.primary.white,width:width*0.9, height:40,flex:1, alignItems:'center'}}>
      <Pressable onPress={()=>setEditIndex(index)} style={{flex:6, display: editIndex==index?'none':'flex'}}>
        <Text style={{flex:1,marginLeft:10}}>{name}</Text> 
      </Pressable>
      {editIndex==index &&
          <Pressable style={{flex:1, flexDirection:'row', alignItems:'center'}}>   
            <Controller
                  control= {control}
                  name="status"
                  render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                    <View style={{flexDirection:'column', flex:1}}>
                      <TextInput
                        value={statusInput}
                        onChangeText={(val)=>setStatusInput(val)}
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
            <Pressable onPress={editStatus} style={{height:40, width:60, justifyContent:'center', alignItems:'center',backgroundColor:colors.primary.purple}}>
              <Ionicons name='send' size={20} color={colors.primary.white}/>
            </Pressable>
          </Pressable>
        }
      <Pressable onPress={()=>{setNewnumber(newnumber==lastnumber?0:newnumber+1);UpdateStatus()}} style={{backgroundColor:color==undefined?colors.primary.gray:color,borderRadius:10, height:20, justifyContent:'center', alignItems:'center', paddingHorizontal:10, margin:10}}>
        <Text>{status}</Text>
      </Pressable>
    </View>
  );
}
export default Status;

