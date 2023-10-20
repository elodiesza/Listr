import { View, Text, StyleSheet,Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors, container } from '../styles';


const SettingsTitle = ({title, returnpress}) => {
    return (
        <View style={container.setting}>
            <Pressable onPress={returnpress}>
                <MaterialIcons name="keyboard-arrow-left" size={25} style={{left:10}} color={colors.primary.blue}/>
            </Pressable>
            <Text style={{marginLeft:30}}>{title}</Text>
        </View>

    );
};
    
export default SettingsTitle;
