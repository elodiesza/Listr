import { View, SafeAreaView, Pressable, Text, Modal, TouchableWithoutFeedback, Button, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { CommonActions } from '@react-navigation/native';
import { container,colors } from '../../styles';
import SettingsTitle from '../../components/SettingsTitle';
import { Ionicons, Entypo, SimpleLineIcons } from '@expo/vector-icons';
import Color from '../../components/Color';
import DeleteDBvalid from '../../modal/DeleteDBvalid';

const DeleteDB = ({db, tasks, setTasks, tracks, setTracks, sections, setSections,
    statuslist, setStatuslist, statusrecords, setStatusrecords,logs, setLogs, setmLogs, sliders, setSliders}) => {

    const navigation = useNavigation();
    const onReturnPressed =()=> {navigation.dispatch(CommonActions.goBack())};

      const [selectedData, setSelectedData] = useState('');
      const [deleteVisible, setDeleteVisible] = useState(false);


    return (

        <SafeAreaView style={container.container}>
            <SettingsTitle returnpress={onReturnPressed}title={'Delete databases'}/>
            <View style={container.body}>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('tasks');setDeleteVisible(true)}}>
                    <Ionicons name="checkbox-outline" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Tasks</Text>
                    <Color color={(tasks==undefined || tasks.length==0)?colors.primary.white:colors.primary.purple}/>
                </Pressable>        
                <Pressable style={container.setting} onPress={()=>{setSelectedData('tracks');setDeleteVisible(true)}}>
                    <SimpleLineIcons name="notebook" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Tracks</Text>
                    <Color color={(tracks==undefined || tracks.length==0)?colors.primary.white:colors.primary.purple}/>
                </Pressable>   
                <Pressable style={container.setting} onPress={()=>{setSelectedData('logs');setDeleteVisible(true)}}>
                    <Ionicons name="list" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Logs</Text>
                    <Color color={(logs==undefined || logs.length==0)?colors.primary.white:colors.primary.purple}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('sections');setDeleteVisible(true)}}>  
                    <Ionicons name="folder" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Sections</Text>
                    <Color color={(sections==undefined || sections.length==0)?colors.primary.white:colors.primary.purple}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('sliders');setDeleteVisible(true)}}>  
                    <Entypo name="progress-two" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>sliders bars</Text>
                    <Color color={(sliders==undefined || sliders.length==0)?colors.primary.white:colors.primary.purple}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('statuslist');setDeleteVisible(true)}}>  
                    <Entypo name="progress-full" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>StatusLists</Text>
                    <Color color={(statuslist==undefined || statuslist.length==0)?colors.primary.white:colors.primary.purple}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('statusrecords');setDeleteVisible(true)}}>
                    <Entypo name="progress-full" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Status records</Text>
                    <Color color={(statusrecords==undefined || statusrecords.length==0)?colors.primary.white:colors.primary.purple}/>
                </Pressable> 
                <DeleteDBvalid db={db} setTasks={setTasks} setTracks={setTracks} setSliders={setSliders} setSections={setSections}
                 setStatusrecords={setStatusrecords} setLogs={setLogs} setmLogs={setmLogs} setStatuslist={setStatuslist} 
                selectedData={selectedData} deleteVisible={deleteVisible} setDeleteVisible={setDeleteVisible}/>
            </View>
        </SafeAreaView>
     
    );
};
    
export default DeleteDB;