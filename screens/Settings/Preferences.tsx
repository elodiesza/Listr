import { View, Switch, Pressable, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import SettingsTitle from '../../components/SettingsTitle';
import { Ionicons, MaterialIcons, Octicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { container,colors } from '../../styles';
import { useState } from 'react';
import Color from '../../components/Color';
import ColorPicker from '../../components/ColorPicker';


const Preferences = ({db}) => {
    const navigation = useNavigation();
    const onReturnPressed =()=> {navigation.dispatch(CommonActions.goBack())};
    const [enabledStarted, setEnabledStarted] = useState(false);
    const [enabledPostpone, setEnabledPostpone] = useState(false);
    const [enabledNotif, setEnabledNotif] = useState(false);
    const toggleStarted = () => setEnabledStarted(previousState => !previousState);
    const togglePostpone = () => setEnabledStarted(previousState => !previousState);
    const toggleNotif = () => setEnabledNotif(previousState => !previousState);
    const [firstday, setFirstday] = useState(false);
    const [colorPickerVisible, setColorPickerVisible] = useState(false);
    const [picked, setPicked] = useState('');

    return (

        <View>
            <SettingsTitle returnpress={onReturnPressed}title={'PREFERENCES'}/>
            <Pressable style={container.setting}>
                <MaterialCommunityIcons name="checkbox-intermediate" size={25}/>
                <Text style={{marginLeft:10}}>Allow 'started' task state</Text>
                <Switch onValueChange={toggleStarted} value={enabledStarted} style={{position: 'absolute',right:10}}/>
            </Pressable>
            <Pressable style={container.setting}>
                <MaterialCommunityIcons name='arrow-right-bold-box-outline' size={25}/>
                <Text style={{marginLeft:10}}>Allow 'postpone' task state</Text>
                <Switch onValueChange={togglePostpone} value={enabledPostpone} style={{position: 'absolute',right:10}}/>
            </Pressable>
            <Pressable style={container.setting}>
                <Feather name='sun' size={25}/>
                <Text style={{marginLeft:10}}>First day of the week</Text>
                <Pressable onPress={()=>setFirstday(!firstday)} style={{width:50,height:30, borderRadius:15, backgroundColor:colors.pale.default,alignItems:'center',justifyContent:'center',position: 'absolute',right:10}}>
                    <View style={{display: firstday? 'flex':'none'}}><Text style={{fontSize:12, fontFamily:'AvenirNextCondensed-Regular'}}>MON</Text></View>
                    <View style={{display: !firstday? 'flex':'none'}}><Text style={{fontSize:12, fontFamily:'AvenirNextCondensed-Regular'}}>SUN</Text></View>
                </Pressable>
            </Pressable>
            <Pressable style={container.setting}>
                <Octicons name='paintbrush' size={25}/>
                <Text style={{marginLeft:10}}>Highlight color</Text>
                <Pressable onPress={()=>setColorPickerVisible(true)} style={{position: 'absolute',right:10}}>
                    <Color color={picked}/>
                </Pressable>
            </Pressable>
            <ColorPicker colorPickerVisible={colorPickerVisible} setColorPickerVisible={setColorPickerVisible} picked={picked} setPicked={setPicked} />
            <Pressable style={container.setting}>
                <MaterialIcons name='wallpaper' size={25}/>
                <Text style={{marginLeft:10}}>Background image</Text>
            </Pressable>
            <Pressable style={container.setting}>
                <Feather name='bell' size={25}/>
                <Text style={{marginLeft:10}}>Notify when a task is about to expire</Text>
                <Switch onValueChange={toggleNotif} value={enabledNotif} style={{position: 'absolute',right:10}}/>
            </Pressable>
            <Pressable style={container.setting}>
                <Ionicons name='timer-outline' size={25} color={enabledNotif?colors.primary.black:colors.primary.gray}/>
                <Text style={{marginLeft:10, color:enabledNotif?colors.primary.black:colors.primary.gray}}>Alert time before expiry</Text>
            </Pressable>
        </View>

    );
};
    
export default Preferences;