import { FlatList, TextInput, TouchableOpacity, Button, Text, View, Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Feather, Octicons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { container, colors } from '../../styles';
import Task from '../../components/Task';
import uuid from 'react-native-uuid';
import { useForm, Controller, set } from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import {StackedBarChart, LineChart, PieChart} from 'react-native-chart-kit';

const width = Dimensions.get('window').width;

function AnalyticsHome({db, tasks, statusrecords, tracks, year, month}) {
    


    const [selectedTrack, setSelectedTrack] = useState('∞');
    const taskCount= ChosenTrackData(selectedTrack).filter(c=>(c.year==year && c.month==month)).length;
    const completedTasks = ChosenTrackData(selectedTrack).filter(c => (c.taskState==2 && c.year==year && c.month==month)).length;
    const recurringdailyTasks = ChosenTrackData(selectedTrack).filter(c => (c.recurring==1 && c.year==year && c.month==month && c.monthly==false)).length;
    const completedrecurringdailyTasks = ChosenTrackData(selectedTrack).filter(c => (c.taskState==2 && c.recurring==1 && c.year==year && c.month==month && c.monthly==false)).length;

    const tasksData = () => {
        let data = [];
        for (let i=1; i<=31; i++) {
            let count = ChosenTrackData(selectedTrack).filter(c => (c.day==i && c.year==year && c.month==month)).length;
            let completed = ChosenTrackData(selectedTrack).filter(c => (c.taskState==2 && c.day==i && c.year==year && c.month==month)).length;
            data.push({day:i, count:count, completed:completed, color:colors.primary.default});
        }
        return data;
    }

    function transposeTasksData(data) {
        const transposedData = new Array(31).fill(null).map(_ => ({}));
    
        data.forEach(item => {
            transposedData[item.day - 1] = {
                day: item.day,
                completed: item.completed,
                count: item.count,
                completedcolor: colors.primary.default,
                color: colors.primary.defaultdark,
            };
        });
    
        return transposedData;
    }


    function ChosenTrackData(pick) {
        if (pick=='∞') {
            return tasks;
        } 
        else if(pick=='☀'){
            return tasks.filter(t => (t.track==undefined || t.track=='DAILY' || t.track=='all'));
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
                <Pressable onPress={()=>setSelectedTrack(item.track)} style={[container.color,{borderColor:selectedTrack==item.track?colors.primary.purple:colors.primary.gray, borderWidth:selectedTrack==item.track?2:1, backgroundColor:item.color}]}>
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
            <View style={{alignItems:'center'}}>
                    <StackedBarChart
                        style={container.statblock}
                        data={
                            {
                                labels: tasksData().map(t=>t.day),
                                data: transposeTasksData(tasksData().map(t=>t)).map(t=>[t.completed,t.count-t.completed]),
                                barColors: [colors.primary.defaultdark, colors.primary.default],
                            }
                        }
                        xLabelsOffset={-5}
                        yLabelsOffset={-10}
                        width={width*0.8}
                        withHorizontalLabels={true}
                        decimalPlaces={0}
                        height={160}
                        hideLegend={true}
                        stackedBar={true}
                        chartConfig = {{
                            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                            barPercentage: 0.2,
                            backgroundGradientFrom: colors.primary.default,
                            backgroundGradientTo: colors.primary.white,
                            decimalPlaces: 0,
                            useShadowColorFromDataset: false,
                            fillShadowGradient: colors.primary.defaultdark,
                            fillShadowGradientOpacity: 1,
                            propsForBackgroundLines: {
                                strokeDasharray: '', 
                                strokeWidth: 1,
                                stroke: colors.primary.default,
                                strokeOpacity: 0.2,
                            },
                            propsForLabels: {
                                fontSize: 6,
                            },
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                    />
            </View>
            <View style={container.statblock}>
                <View style={{alignItems:'center'}}>
                    <Text style={container.headerdate}>Recurring daily</Text>
                    <Text style={container.headerdate}>tasks</Text>
                    <Text style={container.keyNumber}>{recurringdailyTasks}</Text>
                </View>
                <View style={{alignItems:'center'}}>
                    <Text style={container.headerdate}>Completed recurring</Text>
                    <Text style={container.headerdate}>daily tasks</Text>
                    <Text style={[container.keyNumber,{display: recurringdailyTasks==0?'none':'flex'}]}>{(completedrecurringdailyTasks*100/recurringdailyTasks).toFixed(0)}%</Text>
                </View>

            </View>
        </View>
        
    </View>
  );
}
export default AnalyticsHome;
