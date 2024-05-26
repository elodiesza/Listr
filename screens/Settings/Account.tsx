import { View, SafeAreaView, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { container } from '../../styles';
import SettingsTitle from '../../components/SettingsTitle';


const Account = () => {
    const navigation = useNavigation();
    const onAboutPressed =()=> {navigation.dispatch(CommonActions.goBack())};

    return (

        <SafeAreaView style={container.container}>
            <SettingsTitle returnpress={onAboutPressed}title={'ACCOUNT'}/>
            <View style={container.body}>
                <Text> This is Account page</Text>
            </View>
            
        
        </SafeAreaView>

    );
};
    
export default Account;