import { View, SafeAreaView,Pressable,  ScrollView, Text, Button, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { container,colors } from '../../styles';
import SettingsTitle from '../../components/SettingsTitle';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';;

const Data = () => {
    const navigation = useNavigation();
    const onReturnPressed =()=> {navigation.dispatch(CommonActions.goBack())};
    const onDeleteDBPressed =()=> {navigation.navigate('DeleteDB')};

    return (

        <SafeAreaView style={container.container}>
            <SettingsTitle returnpress={onReturnPressed}title={'DATA'}/>
            <View style={container.body}>
                <View style={container.setting}>
                    <Ionicons name="logo-apple" size={25}/>
                    <Text style={{marginLeft:10, color:colors.primary.magenta}}>Link with apple data</Text>
                </View>
                <Pressable onPress={onDeleteDBPressed} style={container.setting}>
                    <Ionicons name="server" size={25}/>
                    <Text style={{marginLeft:10}}>Delete databases</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
            </View>
        </SafeAreaView>

    );
};
    
export default Data;