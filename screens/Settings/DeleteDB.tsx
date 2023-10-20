import { View, SafeAreaView, Pressable, Text, Modal, TouchableWithoutFeedback, Button, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { CommonActions } from '@react-navigation/native';
import { container,colors } from '../../styles';
import SettingsTitle from '../../components/SettingsTitle';
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons, Entypo, SimpleLineIcons } from '@expo/vector-icons';
import Color from '../../components/Color';

const DeleteDB = ({db, tasks, setTasks, tracks, setTracks, load, loadx, 
    statuslist, setStatuslist, statusrecords, setStatusrecords,logs, setLogs}) => {

    const navigation = useNavigation();
    const onReturnPressed =()=> {navigation.dispatch(CommonActions.goBack())};

 

    return (

        <SafeAreaView style={container.container}>
            <SettingsTitle returnpress={onReturnPressed}title={'Delete databases'}/>
            <View style={container.body}>
                <Pressable style={container.setting} onPress={()=>
                        db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS statusrecords', null,
                        (txObj, resultSet) => setStatusrecords([]),
                        (txObj, error) => console.log('error selecting status records')
                        )})}>
                    <Entypo name="progress-full" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Status records</Text>
                    <Color color={statusrecords==undefined?colors.primary.white:colors.primary.blue}/>
                </Pressable> 
                <Pressable style={container.setting} onPress={()=>
                        db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS tasks', null,
                        (txObj, resultSet) => setTasks([]),
                        (txObj, error) => console.log('error selecting tasks')
                      )})}>
                    <Ionicons name="checkbox-outline" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Tasks</Text>
                    <Color color={tasks==undefined?colors.primary.white:colors.primary.blue}/>
                </Pressable>        
                <Pressable style={container.setting} onPress={()=>
                        db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS tracks', null,
                        (txObj, resultSet) => setTracks([]),
                        (txObj, error) => console.log('error selecting tracks')
                      )
                    })}>
                    <SimpleLineIcons name="notebook" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Tracks</Text>
                    <Color color={tracks==undefined?colors.primary.white:colors.primary.blue}/>
                </Pressable>   
                <Pressable style={container.setting} onPress={()=>
                        db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS logs', null,
                        (txObj, resultSet) => setLogs([]),
                        (txObj, error) => console.log('error selecting logs')
                      );
                    })}>
                    <Ionicons name="list" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Logs</Text>
                    <Color color={logs==undefined?colors.primary.white:colors.primary.blue}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>
                        db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS statuslist', null,
                        (txObj, resultSet) => setStatuslist([]),
                        (txObj, error) => console.log('error selecting status list')
                      );
                    })}>  
                    <Entypo name="progress-full" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>StatusLists</Text>
                    <Color color={statuslist==undefined?colors.primary.white:colors.primary.blue}/>
                </Pressable>
            </View>
        </SafeAreaView>
     
    );
};
    
export default DeleteDB;