import { FlatList, TextInput, TouchableOpacity, Button, Text, View, Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Feather, Octicons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { container, colors, paleColor } from '../../styles';
import Task from '../../components/Task';
import uuid from 'react-native-uuid';
import { useForm, Controller, set } from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

const width = Dimensions.get('window').width;

function AnalyticsHome({db, tasks, statusrecords, tracks, year, month}) {
    
    const [selectedTrack, setSelectedTrack] = useState('∞');
    const taskCount= ChosenTrackData(selectedTrack).length;
    const completedTasks = ChosenTrackData(selectedTrack).filter(t => t.taskState==2).length;


    function ChosenTrackData(pick) {
        if (pick=='∞') {
            return tasks;
        } 
        else if(pick=='☀'){
            return tasks.filter(t => t.track==undefined);
        }
        else {
            return tasks.filter(t => t.track==pick);
        }
    }

  return (
    <View style={{flex:1,justifyContent:'flex-start',alignItems:'center'}}>
        <FlatList
            data={[{'track':'∞','color':'#ffffff'},{'track':'☀','color':'#D3DDDF'},...new Set(tracks)]}
            renderItem={({item}) => (
                <Pressable onPress={()=>setSelectedTrack(item.track)} style={[container.color,{backgroundColor:item.color}]}>
                    <Text style={container.title}>{item.track[0]}</Text>
                </Pressable>
            )}
            keyExtractor={item => item.id}
            horizontal={true}
            contentContainerStyle={{height:40, margin:10}}
        />
        <View>
            <Text style={container.headertitle}>{selectedTrack=='☀'?'Daily ☀':selectedTrack}</Text>
        </View>
        <View style={{flex:10, width:'90%'}}>
            <View style={container.statblock}>
                <View style={{alignItems:'center'}}>
                    <Text style={container.headerdate}>Recorded tasks</Text>
                    <Text style={container.keyNumber}>{taskCount}</Text>
                </View>
                <View style={{alignItems:'center'}}>
                    <Text style={container.headerdate}>Completed tasks</Text>
                    <Text style={container.keyNumber}>{completedTasks}</Text>
                </View>
            </View>

        </View>
        
    </View>
  );
}
export default AnalyticsHome;
