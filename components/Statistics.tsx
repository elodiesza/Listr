import { FlatList, TextInput, TouchableOpacity, Button, Text, View, Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { container, colors } from '../styles';
import {StackedBarChart} from 'react-native-chart-kit';
import PieChartView from './PieChartView';

const width = Dimensions.get('window').width;

function AnalyticsHome({tasks, selectedTrack, year, month}) {
    
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
    const thisDay = today.getDate();
    const DaysInMonth = (month,year) => {
        return new Date(year, month+1, 0).getDate();
    }
    
    const taskCount= ChosenTrackData(selectedTrack).filter(c=>(c.year==year && c.month==month)).length;
    const completedTasks = ChosenTrackData(selectedTrack).filter(c => (c.state==2 && c.year==year && c.month==month)).length;
    const recurringdailyTasks = ChosenTrackData(selectedTrack).filter(c => (c.recurring==1 && c.year==year && c.month==month && c.monthly==false)).length;
    const completedrecurringdailyTasks = ChosenTrackData(selectedTrack).filter(c => (c.state==2 && c.recurring==1 && c.year==year && c.month==month && c.monthly==false)).length;
    const numberRecurringDailyTasks = ChosenTrackData(selectedTrack).filter(c => (c.recurring==1 && c.year==year && c.month==month && c.day==(year==thisYear && month==thisMonth)? thisDay: DaysInMonth(month,year) && c.monthly==false)).length;
    
    const monthlyScore =()=>{
        let score = 0;
        for (let i=1; i<DaysInMonth(month,year)+1; i++) {
            let thisdayTaskCount = ChosenTrackData(selectedTrack).filter(c=>(c.year==year && c.month==month &&c.day==i)).length;
            let completionrate = thisdayTaskCount==0?0:(100*(ChosenTrackData(selectedTrack).filter(c=>(c.year==year && c.month==month &&c.day==i)).filter(c=>c.state==2).length*2+ChosenTrackData(selectedTrack).filter(c=>(c.year==year && c.month==month &&c.day==i)).filter(c=>c.state==1).length)/(ChosenTrackData(selectedTrack).filter(c=>(c.year==year && c.month==month &&c.day==i)).length*2));
            score = score + ((thisdayTaskCount==0||completionrate==0)?0:(100*Math.log(ChosenTrackData(selectedTrack).filter(c=>(c.year==year && c.month==month &&c.day==i)).filter(c=>c.state==2).length*2+ChosenTrackData(selectedTrack).filter(c=>(c.year==year && c.month==month &&c.day==i)).filter(c=>c.state==1).length)/Math.log(ChosenTrackData(selectedTrack).filter(c=>(c.year==year && c.month==month &&c.day==i)).length*2)));
        }
        return score.toFixed(0);
    }


    const tasksData = () => {
        let data = [];
        for (let i=1; i<=31; i++) {
            let count = ChosenTrackData(selectedTrack).filter(c => (c.day==i && c.year==year && c.month==month)).length;
            let completed = ChosenTrackData(selectedTrack).filter(c => (c.state==2 && c.day==i && c.year==year && c.month==month)).length;
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
        <View style={{width:width*0.9,justifyContent:'center',alignItems:'center', borderTopColor:colors.primary.black, borderTopWidth:0.5}}>
            <View style={{alignItems:'center',backgroundColor:colors.pale.defaultdark,height:5,width:width*0.9}}/>
            <View style={container.statblock}>
                <View style={{alignItems:'center',height:90}}>
                    <Text style={container.headerdate}>Recorded tasks</Text>
                    <Text style={container.keyNumber}>{taskCount}</Text>
                </View>
                <View style={{alignItems:'center'}}>
                    <Text style={container.headerdate}>Completed tasks</Text>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <PieChartView series={[taskCount==0?1:taskCount-completedTasks,completedTasks]} color={colors.primary.green} pieWidth={60}/>
                        <View style={{position:'absolute'}}>
                            <Text style={container.keyNumber}>{completedTasks}</Text>
                        </View>
                    </View>
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
                    <Text style={container.headerdate}>Percentage of recurring</Text>
                    <Text style={container.headerdate}>daily tasks completion</Text>
                    <Text style={container.keyNumber}>{recurringdailyTasks==0?'- ':(completedrecurringdailyTasks*100/recurringdailyTasks).toFixed(0)}%</Text>
                </View>
                <View style={{alignItems:'center'}}>
                    <Text style={container.headerdate}>Productivity score</Text>
                    <Text style={container.keyNumber}>{monthlyScore()}</Text>
                </View>
            </View>
        </View>
    );
}
export default AnalyticsHome;
