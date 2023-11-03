import { Text, Pressable } from 'react-native';
import { container,colors, paleColor } from '../styles';

function Tab({item, selectedTrack,setSelectedTrack}) {

  return (
    <Pressable onPress={()=>setSelectedTrack(item.track)} style={[container.tab,{ shadowRadius: 5,
      shadowOpacity: selectedTrack==item.track?0.3:0,
      shadowColor: colors.primary.black,
      shadowOffset: { width: 5, height: 5 }, zIndex:item.track==selectedTrack?1:0,bottom:item.track==selectedTrack? -1:1,borderRightWidth:item.track==selectedTrack? 0.5:0,borderLeftWidth:item.track==selectedTrack? 0.5:0,borderTopWidth:item.track==selectedTrack? 0.5:0,backgroundColor:item.color!==""?paleColor(item.color):colors.primary.default}]}>
      <Text style={container.tabtext}>
          {item.track}
      </Text>
    </Pressable>
  );
}

export default Tab;
