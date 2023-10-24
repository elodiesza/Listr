import { View, Switch, SafeAreaView, Pressable, Text, Modal, TouchableWithoutFeedback, Button, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { CommonActions } from '@react-navigation/native';
import { container,colors } from '../../styles';
import SettingsTitle from '../../components/SettingsTitle';
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons, Entypo, SimpleLineIcons } from '@expo/vector-icons';
import Color from '../../components/Color';

const Linkdata = ({db, tasks, setTasks, tracks, setTracks, load, loadx, 
    statuslist, setStatuslist, statusrecords, setStatusrecords,logs, setLogs}) => {

    const navigation = useNavigation();
    const onReturnPressed =()=> {navigation.dispatch(CommonActions.goBack())};
    const [enabledAppleReminders, setEnabledAppleReminders] = useState(false);
    const toggleAppleReminders = () => setEnabledAppleReminders(previousState => !previousState);
    const [enabledGoogleTasks, setEnabledGoogleTasks] = useState(false);
    const toggleGoogleTasks = () => setEnabledGoogleTasks(previousState => !previousState);
    const [enabledTrackr, setEnabledTrackr] = useState(false);
    const toggleTrackr = () => setEnabledTrackr(previousState => !previousState);

    return (

        <SafeAreaView style={container.container}>
          <View style={container.body}>
            <SettingsTitle returnpress={onReturnPressed}title={'Link data to other apps'}/>
            <View style={container.setting}>
              <Ionicons name="logo-apple" size={25}/>
              <Text style={{marginLeft:10}}>Apple reminders</Text>
              <Switch onValueChange={toggleAppleReminders} value={enabledAppleReminders} style={{position: 'absolute',right:10}}/>
            </View>
            <View style={container.setting}>
              <MaterialCommunityIcons name="google" size={25}/>
              <Text style={{marginLeft:10}}>Google Tasks</Text>
              <Switch onValueChange={toggleGoogleTasks} value={enabledGoogleTasks} style={{position: 'absolute',right:10}}/>
            </View>
            <View style={container.setting}>
              <Ionicons name="stats-chart" size={25}/>
              <Text style={{marginLeft:10}}>Trackr habits</Text>
              <Switch onValueChange={toggleGoogleTasks} value={enabledGoogleTasks} style={{position: 'absolute',right:10}}/>
            </View>
          </View>
        </SafeAreaView>
     
    );
};
    
export default Linkdata;