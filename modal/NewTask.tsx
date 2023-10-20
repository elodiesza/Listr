import React, { useState, useEffect } from 'react';
import { SafeAreaView, Switch, Dimensions, Button, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import uuid from 'react-native-uuid';
import { container,colors } from '../styles';
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import CalendarPicker from 'react-native-calendar-picker';


const width = Dimensions.get('window').width;

function NewTask({addModalVisible, setAddModalVisible, db, tasks, setTasks, tracks, track, section, pageDate, tracksScreen, monthly}) {

  const {control, handleSubmit, reset} = useForm();
  const [date, setDate] = useState(pageDate)
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [time, setTime] = useState(new Date())
  const [showTimePicker, setShowTimePicker] = useState(true);
  const [dateDisplay, setDateDisplay] = useState<"none" | "flex" | undefined>('none');
  const [addDeadline, setAddDeadline] = useState('Add Deadline');
  const [timeDisplay, setTimeDisplay] = useState<"none" | "flex" | undefined>('none');
  const [addTime, setAddTime] = useState('Add Time');
  const [load, loadx] = useState(false);
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
  const [selectedTrack, setSelectedTrack] = useState(track);

  const [recurring, setRecurring] = useState(0);


  function CheckColor(color) {
    var c = color.substring(1);      // strip #
    var rgb = parseInt(c, 16);   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff;  // extract red
    var g = (rgb >>  8) & 0xff;  // extract green
    var b = (rgb >>  0) & 0xff;  // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    if (luma < 40) {
      return colors.primary.white;
    }
    else {
      return colors.primary.black;
    }
  }

  useEffect(() => {
    if (!addModalVisible) {
      reset();
    }
  }, [addModalVisible, reset]);


    const onChange = (selectedDate) => {
      const currentDate = selectedDate || date;
      setShowDatePicker(Platform.OS === 'ios');
      setDate(currentDate);
    };

    const onChange2 = (event, selectedTime) => {
      const currentTime = selectedTime || time;
      setShowTimePicker(Platform.OS === 'ios');
      setTime(currentTime);
    };

  const addTask = async (data) => {

    let existingTasks = [...tasks]; 
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO tasks (id,task,year,month,day,taskState,recurring, monthly, track, time, section) values (?,?,?,?,?,?,?,?,?,?,?)',[uuid.v4(),data.task,tracksScreen?undefined:addDeadline=='Add deadline'?pageDate.getFullYear():moment(date).format('YYYY'),tracksScreen?undefined:addDeadline=='Add deadline'?pageDate.getMonth():parseInt(moment(date).format('MM'))-1,tracksScreen?undefined:addDeadline=='Add deadline'?pageDate.getDate():moment(date).format('DD'),0,recurring==1?1:0,monthly?1:0,selectedTrack,addTime=='Add Time'?null:time.toString(),section==undefined?undefined:section],
      (txtObj,resultSet)=> {    
        existingTasks.push({ id: uuid.v4(), task: data.task, year:tracksScreen?undefined:addDeadline=='Add deadline'?pageDate.getFullYear():moment(date).format('YYYY'), month:tracksScreen?undefined:addDeadline=='Add deadline'?pageDate.getMonth():parseInt(moment(date).format('MM'))-1, day:tracksScreen?undefined:addDeadline=='Add deadline'?pageDate.getDate():moment(date).format('DD'), taskState:0, recurring:recurring==1?1:0, monthly:monthly?1:0, track:selectedTrack, time:addTime=='Add Time'?null:time.toString(), section});
        setTasks(existingTasks);
      },
      (txtObj, error) => console.warn('Error inserting data:', error)
      );
    });
    setRecurring(0);
    setTime(new Date());
    setAddTime('Add Time');
    setAddDeadline('Add deadline');
    setDate(pageDate);  
    setDateDisplay('none');
    setTimeDisplay('none');
    setAddModalVisible(false);
    loadx(!load);
    setSelectedTrack(track);
  };


  return (
    <Modal
      isVisible={addModalVisible}
      onBackdropPress={() => {
        setAddModalVisible(!addModalVisible);
        setRecurring(0);
        setTime(new Date());
        setAddTime('Add Time');
        setAddDeadline('Add deadline');
        setDate(pageDate);  
        setDateDisplay('none');
        setTimeDisplay('none');
        setSelectedTrack(track);
      }}
      backdropColor='white'
      avoidKeyboard={true}
      style={{margin: 0,justifyContent:'flex-end',alignItems:'center', width:width}}
    > 
      <TouchableOpacity onPressOut={() => {
        setAddModalVisible(!addModalVisible);
        setRecurring(0);
        setTime(new Date());
        setAddTime('Add Time');
        setAddDeadline('Add deadline');
        setDate(pageDate);  
        setDateDisplay('none');
        setTimeDisplay('none');
        setSelectedTrack(track);
        }} 
        activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={container.newModal}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Controller
              control= {control}
              name="task"
              render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                <View style={{flexDirection:'column'}}>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Insert new task"
                    style={[container.textinput,{width:monthly?width-60:width-80,borderColor: error ? 'red' : '#e8e8e8'}]}
                  />
                  {error && (
                    <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                  )}
                </View>
              )}
              rules={{
                required: 'Input a task',
                minLength: {
                  value: 3,
                  message: 'Task should be at least 3 characters long',
                },
                maxLength: {
                  value: 50,
                  message: 'Task should be max 50 characters long',
                },
              }}
              />
              <View style={{flexDirection:'row', justifyContent:'flex-end',width:80}}>
                <Pressable style={{marginRight:5, display: (recurring==1 || monthly)? 'none': track==undefined ? "flex" : "none"}} onPress={() => (setDateDisplay(dateDisplay==='none'? 'flex' : 'none'), setAddDeadline(addDeadline==='Add Deadline'? 'Cancel Deadline' : 'Add Deadline'))}>
                  <AntDesign name='calendar' size={20}/>
                </Pressable>
                <View style={{display: dateDisplay,position:'absolute',top:-420}}>
                  {showDatePicker && (
                    <CalendarPicker
                      startFromMonday={true}
                      allowRangeSelection={false}
                      minDate={date==undefined?pageDate:date}
                      todayBackgroundColor={colors.pale.purple}
                      selectedDayColor={colors.primary.purple}
                      selectedDayTextColor={colors.primary.white}
                      onDateChange={onChange}
                    />
                  )}
                  <Button title={addTime} onPress={() => (setTimeDisplay(timeDisplay==='none'? 'flex' : 'none'), setAddTime(addTime==='Add Time'? 'Cancel Time' : 'Add Time'))}/>
                  <View style={{display: timeDisplay,alignItems:'center'}}>
                    {showTimePicker && (
                      <DateTimePicker
                        value={time}
                        mode="time"
                        display="default"
                        onChange={onChange2}
                        minuteInterval={5}
                      />
                    )}
                  </View>
                </View>
                <Pressable style={{marginRight:5, display: track==undefined? "flex" : "none"}} onPress={() => setRecurring(recurring==1?0:1)}>
                  <Entypo name='cycle' size={20} color={recurring==1? colors.primary.purple : colors.primary.black}/>
                </Pressable>
                <Pressable onPress={handleSubmit(addTask)} style={{marginRight:5}}>
                  <Feather name='plus-circle' size={20}/>
                </Pressable>
              </View>
            </View> 
            <View style={{flex:1,display:monthly?'none':'flex'}}>
              <FlatList
                data={[{'track':'DAILY','color':'#D3DDDF'},...new Set(tracks)]}
                renderItem={({item}) => (
                  <Pressable onPress={()=>setSelectedTrack(item.track)} style={[container.color, {backgroundColor: item.color==''?colors.primary.default:item.color, width:25,height:25,borderColor:item.track==selectedTrack?colors.primary.purple:colors.primary.gray,opacity:item.track==selectedTrack?1:0.5}]}>
                    <Text style={{color:item.color==''?colors.primary.black:CheckColor(item.color),fontWeight:'bold'}}>{item.track[0]}</Text>
                  </Pressable>
                )}
                horizontal={true}
                keyExtractor= {(item,index) => index.toString()}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>     
      </TouchableOpacity>
    </Modal>
  );
};

export default NewTask;