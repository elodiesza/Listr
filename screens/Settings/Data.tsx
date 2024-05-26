import { View, SafeAreaView,Pressable, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { container,colors } from '../../styles';
import SettingsTitle from '../../components/SettingsTitle';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const Data = () => {
    const navigation = useNavigation();
    const onReturnPressed =()=> {navigation.dispatch(CommonActions.goBack())};
    const onDeleteDBPressed =()=> {navigation.navigate('DeleteDB')};
    const onLinkdataPressed =()=> {navigation.navigate('Linkdata')};

    return (

        <SafeAreaView style={container.container}>
            <SettingsTitle returnpress={onReturnPressed}title={'DATA'}/>
            <View style={container.body}>
                <Pressable onPress={onDeleteDBPressed} style={container.setting}>
                    <Ionicons name="server" size={25}/>
                    <Text style={{marginLeft:10}}>Delete databases</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
                <Pressable style={container.setting}>
                    <MaterialCommunityIcons name="archive-remove-outline" size={25}/>
                    <Text style={{marginLeft:10, color:colors.primary.magenta}}>Delete all archives</Text>
                </Pressable>
                <Pressable onPress={onLinkdataPressed} style={container.setting}>
                    <Feather name="link" size={25}/>
                    <Text style={{marginLeft:10, color:colors.primary.magenta}}>Link data to other apps</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
                <Pressable style={container.setting}>
                    <MaterialCommunityIcons name="export" size={25}/>
                    <Text style={{marginLeft:10, color:colors.primary.magenta}}>Export data</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
            </View>
        </SafeAreaView>

    );
};
    
export default Data;