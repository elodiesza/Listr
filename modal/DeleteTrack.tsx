import { useState, useEffect } from 'react';
import { Dimensions,TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { container,colors } from '../styles';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';

const width = Dimensions.get('window').width;

function DeleteTrack({deleteTrackVisible, setDeleteTrackVisible, db, tracks, setTracks, selectedTab, setSelectedTab, sections, setSections, tasks, setTasks}) {


  const DeleteTrackDB = () => {
    const id = tracks.filter((c) => c.track == selectedTab).map((c) => c.id)[0];
    db.transaction(
        (tx) => {
        tx.executeSql(
            'DELETE FROM sections WHERE track = ?',
            [id],
            (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
                let existingSections = [...sections].filter((c) => c.track !== selectedTab);
                setSections(existingSections);
            }
            },
            (txObj, error) => console.log(error)
        );
        }
    );

    db.transaction(
        (tx) => {
        tx.executeSql(
            'DELETE FROM tasks WHERE track = ?',
            [id],
            (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
                let existingTasks = [...tasks].filter((c) => c.track !== selectedTab);
                setTasks(existingTasks);
            }
            },
            (txObj, error) => console.log(error)
        );
        }
    );

    db.transaction(
        (tx) => {
        tx.executeSql(
            'DELETE FROM tracks WHERE id = ?',
            [id],
            (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
                let existingTracks = [...tracks].filter((c) => c.id !== id);
                setTracks(existingTracks);
                setSelectedTab(existingTracks.map(c=>c.track)[0]);
            }
            },
            (txObj, error) => console.log(error)
        );
        }
    );
    setSelectedTab('UNLISTED');
    setDeleteTrackVisible(false);
};


  return (
    <Modal
      isVisible={deleteTrackVisible}
      onBackdropPress={() => {
        setDeleteTrackVisible(!deleteTrackVisible);
      }}
        backdropColor='white'
        avoidKeyboard={true}
        style={{margin: 0,justifyContent:'flex-end',alignItems:'center', width:width}}
    > 
      <TouchableOpacity onPressOut={() => setDeleteTrackVisible(!deleteTrackVisible)} activeOpacity={1}>
        <TouchableWithoutFeedback>
            <View style={[container.newModal,{alignItems:'center'}]}>
                <View style={{width:"100%",flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                    <Pressable onPress={() => setDeleteTrackVisible(!deleteTrackVisible)}>
                        <MaterialIcons name="keyboard-arrow-left" size={25} color={colors.primary.blue}/>
                    </Pressable>
                    <Text style={{left:20, flexWrap:'wrap'}}>Delete {selectedTab} and its sections/tasks definitely ?</Text>
                </View>
                <Pressable onPress={()=>DeleteTrackDB()} style={[container.button,{flexDirection:'row', alignItems:'center',justifyContent:'center',height:40, width:150, marginRight:5}]}>
                    <Text> DELETE </Text>
                </Pressable>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default DeleteTrack;