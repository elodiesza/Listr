import { SafeAreaView,TouchableOpacity, Pressable, ScrollView, FlatList, StyleSheet, Text, View, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper'
import MonthlyTasks from './MonthlyTasks';
import { container, colors } from '../styles';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const width = Dimensions.get('window').width;

export default function Monthly({year, month, tasks, tracks, setTracks, load, loadx, db, setTasks}) {
  const insets = useSafeAreaInsets();
  const height = Dimensions.get('window').height - insets.top - insets.bottom; 

  var today = new Date();
  var thisDay = today.getDate();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
  var days = [];
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarDate,setCalendarDate] = useState(0);

  const GetDaysInMonth = (month) => {
    var date = new Date(year, month, 1);
    var firstDay = date.getDay();
    if (firstDay == 0) {
      for (let i=0; i<6; i++) {
        days.push(0);
      }
      while (date.getMonth() === month) {
        days.push(new Date(date).getDate());
        date.setDate(date.getDate() + 1);
      }
    }
    else {
      for (let i=1; i<firstDay; i++) {
        days.push(0);
      }
      while (date.getMonth() === month) {
        days.push(new Date(date).getDate());
        date.setDate(date.getDate() + 1);
      }
    }
    if (days.length<42) {
      for (let i=days.length; i<42; i++) {
        days.push(0);
      }
    }
    return days;
  }

  var daysLength = GetDaysInMonth(month).length;

  var line1 = GetDaysInMonth(month).slice(0,7);
  var line2 = GetDaysInMonth(month).slice(7,14);
  var line3 = GetDaysInMonth(month).slice(14,21);
  var line4 = GetDaysInMonth(month).slice(21,28);
  var line5 = () => { 
    let list=[];
    if (daysLength>28) {
        for (let i=0; i<7;i++){
          list.push(GetDaysInMonth(month)[28+i]);
        }
        for (let i=0; i<(35-daysLength);i++){
            list.push(0);
          }
      return(list)
    }
    else {
      list.push(0,0,0,0,0,0,0);
      return(list)
    }
  }
  var line6 = () => { 
    let list=[];
    if (daysLength>34) {

        for (let i=0; i<7;i++){
          list.push(GetDaysInMonth(month)[35+i]);
        }
      return(list)
    }
    else {
      list.push(0,0,0,0,0,0,0);
      return(list)
    }
  }

  var daysLines = [line1,line2,line3,line4,line5(),line6()];

  const monthTodo = (tasks, year, month, day) => {
    if(day>0 && day<32) {
      return(tasks.filter(
        c=>(c.year==year && c.month==month && c.day==day)
      ))
    }
  };

  const CalendarCell = (date) => {
    return(
      <View style={[styles.calendarCell,{backgroundColor: date==0? 'lightgray' : 'white', borderColor: (date==thisDay && month==thisMonth && year==thisYear)? colors.primary.purple:colors.pale.black, borderWidth: (date==thisDay && month==thisMonth && year==thisYear)? 2:0.5}]}>
        <View style={{height:15, flexDirection:'row', justifyContent:'flex-end'}}>
          <Pressable onPress={()=>{setCalendarDate(date);setModalVisible(true);}}>
            <Text style={{fontFamily:'AvenirNextCondensed-Regular',textAlign:'right', textAlignVertical:'top', marginRight:3, opacity: date==0? 0 : 1}}>{date}</Text>
          </Pressable>
        </View>
        <View style={{justifyContent: 'flex-end',flex:1}}>
          <FlatList 
          data={monthTodo(tasks.filter(c=>c.recurring==false), year, month, date)}
          horizontal={false} 
          scrollEnabled={true} 
          renderItem={RenderTaskItem} 
          bounces={false} />
        </View>
      </View>
    )
  }

  const CalendarLine = (line) => {
    return (
        <FlatList
            data={line}
            renderItem={({item}) => CalendarCell(item)}
            keyExtractor={item => item.id}
            horizontal={true}
            bounces={false}
            contentContainerStyle={{height:(height-150-3)/7}}
          />  

    )
  }

  const CalendarTaskItem = ({task, track}) => (
    <>
      <TouchableOpacity style={[styles.task,{backgroundColor: tracks.filter(c=>c.track==track).map(c=>c.color)[0]}]}>
        <Text style={{fontSize:10}}>{task}</Text>
      </TouchableOpacity>
    </>
  );
  const RenderTaskItem = ({item}) => (
    <CalendarTaskItem task={item.task} track={item.track} />
  );

  return (
    <View style={container.body}>
        <Swiper horizontal={false} showsButtons={false} showsPagination={false} loop={false} index={0}>
          <MonthlyTasks db={db} load={load} loadx={loadx} tracks={tracks} setTracks={setTracks} year={year} month={month} tasks={tasks} setTasks={setTasks}/>
          <View style={{flex:1, justifyContent:'flex-start',width:'100%',paddingBottom:60}}>
            <View style={{height:30}}>
              <FlatList
                data={["MON","TUE","WED","THU","FRI","SAT","SUN"]}
                renderItem={({item}) => (
                  <View style={{backgroundColor:colors.primary.default, width:width/7, height:30, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontFamily:'AvenirNextCondensed-Regular'}}>{item}</Text>
                  </View>
                )}
                keyExtractor={item => item.id}
                horizontal={true}
                contentContainerStyle={{borderBottomColor:colors.primary.defaultdark, borderBottomWidth: 1}}
              />
            </View>
            <FlatList
              data={daysLines}
              renderItem={({item}) => CalendarLine(item)}
              keyExtractor={item => item.id} 
              scrollEnabled={false}
              contentContainerStyle={{flex:1,backgroundColor:'blue'}}
            />
          </View>
        </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarCell: {
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: width/7,
    flex:1/7,
  },
  task: {
    width: width/7-1,
    height: 14,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 2,
  }
});
