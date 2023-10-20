import { View, SafeAreaView, Text, Pressable, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, container } from '../../styles';
import { Octicons, MaterialIcons, Feather } from '@expo/vector-icons';


const SettingsHome = () => {
    const navigation = useNavigation();
    
    const onAccountPressed =()=> {navigation.navigate('Account')};
    const onAboutPressed =()=> {navigation.navigate('About')};
    const onDataPressed =()=> {navigation.navigate('Data')};
    const onCustomizationPressed =()=> {navigation.navigate('Customization')};
    const onHelpPressed =()=> {navigation.navigate('Help')};

    return (

        <SafeAreaView style={container.container}>
            <View style={[container.body,{justifyContent:'flex-start'}]}>
                <Pressable onPress={onAccountPressed} style={container.setting}>
                    <MaterialIcons name="account-circle" size={25}/>
                    <Text style={{marginLeft:10}}>Account</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
                <Pressable onPress={onAboutPressed} style={container.setting}>
                    <Octicons name="info" size={25}/>
                    <Text style={{marginLeft:10}}>About</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
                <Pressable onPress={onDataPressed} style={container.setting}>
                    <Feather name="server" size={25}/>
                    <Text style={{marginLeft:10}}>Data</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
                <Pressable onPress={onCustomizationPressed} style={container.setting}>
                    <MaterialIcons name="auto-awesome" size={25}/>
                    <Text style={{marginLeft:10}}>Customization</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
                <Pressable onPress={onHelpPressed} style={container.setting}>
                    <Feather name="help-circle" size={25}/>
                    <Text style={{marginLeft:10}}>Help Center</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
                <Pressable style={container.setting}>
                    <MaterialIcons name="exit-to-app" size={25}/>
                    <Text style={{marginLeft:10}}>Sign Out</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
            </View>
        </SafeAreaView>

    );
};
    
export default SettingsHome;

