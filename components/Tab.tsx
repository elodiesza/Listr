import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { container } from '../styles';
import Svg, { Path } from 'react-native-svg';

function Tab({color,title, onPress}) {

const pathData = `M 0 40 Q 15 40, 20 30 L 30,10 Q 35 0, 45 0 H 140 Q 150 0, 155 10 L 165 30 Q 170 40, 180 40 `; 
  return (
    <Pressable onPress={onPress} style={[container.container,{backgroundColor:'transparent',height:40,flexDirection:'row', alignItems:'flex-end',width:180}]}>
        <Svg>
            <Path d={pathData} fill={color} strokeWidth={0.5} stroke={'black'}  />
        </Svg>
        <Text style={{fontSize:16,fontFamily:'AvenirNextCondensed-Regular',position:'absolute', bottom:8}}> {title} </Text>
    </Pressable>
  );
}

export default Tab;
