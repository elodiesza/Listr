import React, { useState, useEffect } from 'react';
import { FlatList, Pressable, Button, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {colors,container} from '../styles.js';
import uuid from 'react-native-uuid';

const width = Dimensions.get('window').width;

const StickerList = ({ db, stickers, setStickers, stickerrecords, setStickerrecords, year, month, day}) => {


  const updateSticker = (name) => {
    const existingrecords = [...stickerrecords];
    let currentState=stickerrecords.filter(c=>(c.year==year&&c.month==month&&c.day==day&&c.name==name)).map(c=>c.state)[0];
    if (stickerrecords.filter(c=>(c.year==year&&c.month==month&&c.day==day&&c.name==name)).length==0){
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO stickerrecords (id, name, year, month, day, state) VALUES (?, ?, ?, ?, ?, ?)',
          [ uuid.v4(), name, year, month, day, true],
          (txtObj, stateResultSet) => {
            existingrecords.push({id:uuid.v4(), name:name, year:year, month:month, day:day, state:true});
            setStickerrecords(existingrecords);
          }
        );
      });
    }
    else {
      let stickerId = existingrecords.filter(c=>(c.name==name && c.year==year && c.month==month && c.day==day)).map(c=>c.id)[0];
      let stickerIndex = existingrecords.findIndex(c => c.id === stickerId);
      db.transaction(tx=> {
          tx.executeSql('UPDATE stickerrecords SET state = ? WHERE id= ?', [!currentState, stickerId],
              (txObj, resultSet) => {
                existingrecords[stickerIndex].state = !currentState;
                setStickerrecords(existingrecords);
                currentState = !currentState;
              },
              (txObj, error) => console.log('Error updating data', error)
          );
      });
    }
    
  };

  return (
    <View style={[container.body,{height:30,width:'100%',flexDirection:'row'}]}>
      <FlatList
        data={stickers}
        renderItem={({item}) =>(
          <TouchableOpacity onPress={()=>updateSticker(item.name)} style={{marginHorizontal:5}}>
            <View style={{position:'absolute'}}>
              <Ionicons name={item.icon} size={30} color={stickerrecords.filter(c=>(c.year==year&&c.month==month&&c.day==day&&c.name==item.name)).map(c=>c.state)[0]==true?item.color:'transparent'}/>
            </View>
            <Ionicons name={item.icon+'-outline'} size={30} color={stickerrecords.filter(c=>(c.year==year&&c.month==month&&c.day==day&&c.name==item.name)).map(c=>c.state)[0]==true?colors.primary.black:colors.primary.blue}/>
          </TouchableOpacity> 
        )}
        keyExtractor={(_, index) => index.toString()}
        horizontal={true}
      />
    </View>
  );
}

export default StickerList;

