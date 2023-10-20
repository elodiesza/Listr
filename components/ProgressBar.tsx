import { StyleSheet, Button, TouchableOpacity, Text, View, Dimensions, Pressable, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { container, colors} from '../styles';
import Slider from '@react-native-community/slider';



const width = Dimensions.get('window').width;

function ProgressBar({db, name, progress, setProgress, value, id, color}) {

  const [newProgress, setNewProgress] = useState(value);
  const [nameClicked, setNameClicked] = useState(false);
  

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

  return (
    <View style={{flexDirection:'row',backgroundColor:colors.primary.white,width:width*0.9, height:40,flex:1}}>
        <Pressable onPress={()=>setNameClicked(!nameClicked)} style={{flex:nameClicked?3/4:1/4,justifyContent:'center', marginLeft:10}}>
          <Text style={{textAlign:'left'}}>{name}</Text>
        </Pressable>
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

