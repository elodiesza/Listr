import { View, SafeAreaView, Text, Pressable, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, container } from '../../styles';
import { Octicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { Auth } from 'aws-amplify';



const SettingsHome = () => {
    const navigation = useNavigation();
    
    const onAccountPressed =()=> {navigation.navigate('Account')};
    const onAboutPressed =()=> {navigation.navigate('About')};
    const onDataPressed =()=> {navigation.navigate('Data')};
    const onPreferencesPressed =()=> {navigation.navigate('Preferences')};
    const onHelpPressed =()=> {navigation.navigate('Help')};

    const handleLogout = async () => {
        try {
          await Auth.signOut();
          // Perform any additional actions (e.g., navigating to a sign-in screen).
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };

    return (

        <SafeAreaView style={container.container}>
            <View style={[container.body,{justifyContent:'flex-start'}]}>
                <Pressable onPress={onAccountPressed} style={container.setting}>
                    <MaterialIcons name="account-circle" size={25}/>
                    <Text style={{marginLeft:10, color:colors.primary.magenta}}>Account</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
                <Pressable onPress={onAboutPressed} style={container.setting}>
                    <Octicons name="info" size={25}/>
                    <Text style={{marginLeft:10, color:colors.primary.magenta}}>About</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
                <Pressable onPress={onDataPressed} style={container.setting}>
                    <Feather name="server" size={25}/>
                    <Text style={{marginLeft:10}}>Data</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
                <Pressable onPress={onPreferencesPressed} style={container.setting}>
                    <MaterialIcons name="auto-awesome" size={25}/>
                    <Text style={{marginLeft:10, color:colors.primary.magenta}}>Preferences</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
                <Pressable onPress={onHelpPressed} style={container.setting}>
                    <Feather name="help-circle" size={25}/>
                    <Text style={{marginLeft:10, color:colors.primary.magenta}}>Help Center</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
                <Pressable onPress={handleLogout} style={container.setting}>
                    <MaterialIcons name="exit-to-app" size={25}/>
                    <Text style={{marginLeft:10, color:colors.primary.magenta}}>Log Out</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={container.settingsArrow}/>
                </Pressable>
                <Text style={{marginLeft:10}}> Settings in magenta are not yet released</Text>
            </View>
        </SafeAreaView>
    );
};
    
export default SettingsHome;

