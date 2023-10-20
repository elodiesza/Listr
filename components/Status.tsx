import { StyleSheet, Button, TouchableOpacity, Text, View, Dimensions, Pressable, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { container, colors} from '../styles';


const width = Dimensions.get('window').width;

function Status({db, name, list, statuslist, statusrecords, setStatusrecords, number, id}) {


  const [status, setStatus] = useState(statuslist.filter(c=>c.name==list).map(c=>c.item)[number]);
  const [color, setColor] = useState(statuslist.filter(c=>c.name==list).map(c=>c.color)[number]);
  const lastnumber = statuslist.filter(c=>c.name==list).map(c=>c.number).length-1;
  const [newnumber, setNewnumber] = useState(number);

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

  return (
    <View style={{flexDirection:'row',backgroundColor:colors.primary.white,width:width*0.9, height:40,flex:1, alignItems:'center'}}>
      <Text style={{flex:1,marginLeft:10}}>{name}</Text>
      <Pressable onPress={()=>{setNewnumber(newnumber==lastnumber?0:newnumber+1);UpdateStatus()}} style={{backgroundColor:color==undefined?colors.primary.gray:color,borderRadius:10, height:20, justifyContent:'center', alignItems:'center', paddingHorizontal:10, margin:10}}>
        <Text>{status}</Text>
      </Pressable>
    </View>
  );
}
export default Status;

