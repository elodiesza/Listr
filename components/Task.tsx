import { TextInput, StyleSheet, Button, TouchableOpacity, Text, View, Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons, Entypo, Feather } from '@expo/vector-icons';
import moment from 'moment';
import { container} from '../styles';
import { colors } from '../styles';
import uuid from 'react-native-uuid';
import { useForm, Controller, set } from 'react-hook-form';


const width = Dimensions.get('window').width;

function Task({db, tasks, setTasks, tracks, setTracks, sections, date,task, taskState, id ,track, time, section, trackScreen, archive, recurring, tabcolor}) {
  
  const {control, handleSubmit, reset} = useForm();
  const [value, setValue] = useState('');
  const [editOn,setEditOn] = useState(false);


  const today= new Date();
  const updateTaskState = () => {
    let existingTasks=[...tasks];
    let indexToUpdate = existingTasks.findIndex(c => c.id === id);
    let postponedTask = existingTasks[indexToUpdate].task;
    let nextDay= date==undefined? undefined:new Date(Math.floor(date.getTime()+(1000*60*60*24)));
    let nextDayYear = date==undefined? undefined:nextDay.getFullYear();
    let nextDayMonth = date==undefined? undefined:nextDay.getMonth();
    let nextDayDay = date==undefined? undefined:nextDay.getDate();
    let copytrack=existingTasks[indexToUpdate].track;
    let copyTime=existingTasks[indexToUpdate].time;
    if (existingTasks[indexToUpdate].taskState==0){
      db.transaction(tx=> {
        tx.executeSql('UPDATE tasks SET taskState = ? WHERE id = ?', [1, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingTasks[indexToUpdate].taskState = 1;
              setTasks(existingTasks);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
    }
    else if(existingTasks[indexToUpdate].taskState==1){
      db.transaction(tx=> {
        tx.executeSql('UPDATE tasks SET taskState = ? WHERE id = ?', [2, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingTasks[indexToUpdate].taskState = 2;
              setTasks(existingTasks);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
    }
    else if(existingTasks[indexToUpdate].taskState==2){
      if (existingTasks[indexToUpdate].recurring==0 && date!==undefined){
        db.transaction(tx=> {
          tx.executeSql('UPDATE tasks SET taskState = ? WHERE id = ?', [3, id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                existingTasks[indexToUpdate].taskState = 3;
                setTasks(existingTasks);
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
        db.transaction(tx => {
          tx.executeSql('INSERT INTO tasks (id,task,year,month,day,taskState,recurring,track,time, section) values (?,?,?,?,?,?,?,?,?,?)',
          [ uuid.v4(),postponedTask,nextDayYear,nextDayMonth,nextDayDay,0,0,copytrack,copyTime, section],
            (txtObj,resultSet)=> {   
              existingTasks.push({ id: uuid.v4(), task: postponedTask, year: nextDayYear, month:nextDayMonth, day:nextDayDay, taskState:0, recurring:0, track:copytrack, time:copyTime, section:section});
            },
          );
        });
      }
      else {
        db.transaction(tx=> {
          tx.executeSql('UPDATE tasks SET taskState = ? WHERE id = ?', [0, id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                existingTasks[indexToUpdate].taskState = 0;
                setTasks(existingTasks);
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
      }
    }
    else {
      db.transaction(tx=> {
        tx.executeSql('UPDATE tasks SET taskState = ? WHERE id = ?', [0, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingTasks[indexToUpdate].taskState = 0;
              setTasks(existingTasks);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
      let postponedTaskId = existingTasks.filter(c=>(c.year==nextDayYear && c.month==nextDayMonth && c.day==nextDayDay && c.task==postponedTask)).map(c=>c.id)[0];
      db.transaction(tx=> {
        tx.executeSql('DELETE FROM tasks WHERE id = ?', [postponedTaskId],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              let existingTasks = [...tasks].filter(task => task.id !==postponedTaskId);
              setTasks(existingTasks);
            }
          },
          (txObj, error) => console.log(error)
        );       
      }) 
    }
  };
  const taskTime= time=="null"? "":moment(time).format('HH:mm');

  const editTask = (data) => {
    console.warn('edited task')
    let existingTasks=[...tasks];
    console.warn('lol', data.task);
    const indexToUpdate = existingTasks.findIndex(c => c.id === id);
      db.transaction(tx=> {
        tx.executeSql('UPDATE tasks SET task = ? WHERE id = ?', [data.task, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingTasks[indexToUpdate].task = data.task;
              setTasks(existingTasks);
            }
          },
          (txObj, error) => console.log('Error updating task', error)
        );
      });
      setEditOn(false);
  };

  return (
    <View style={container.taskcontainer}>
      <View style={{display:(recurring==0 || trackScreen)?"none":"flex",height:40,justifyContent:'center', alignContent:'center', alignItems:'flex-end'}}>
        <Entypo name="cycle" size={20} color={colors.primary.black} />
      </View>
      <View style={{display:(trackScreen && moment(date).format("YY-MM-DD")==moment(today).format("YY-MM-DD"))?"flex":"none",height:40,justifyContent:'center', alignContent:'center', alignItems:'flex-end'}}>
        <Feather name="calendar" size={20} color={colors.primary.black} />
      </View>
      <Pressable onPress={()=>setEditOn(true)} style={{flex:6, display: editOn?'none':'flex'}}>
        <Text style={{marginLeft:5,display:(section==undefined || trackScreen)?"none":"flex",color:tabcolor, fontWeight:'bold'}}>
          {section} >
        </Text>        
        <Text style={container.tasktext}>
          {task}
        </Text>
      </Pressable>
      <Pressable style={{flex:1, display: editOn?'flex':'none', flexDirection:'row'}}>
        <Controller
              control= {control}
              name="task"
              render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                <View style={{flexDirection:'column'}}>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={task}
                    style={{borderColor: error ? 'red' : '#e8e8e8',height:50,flex:1,width:width-100}}
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
        <Pressable onPress={()=>{setEditOn(false);setValue(task)}} style={{flex:1}}>
          <Feather name="x-circle" size={20} color={colors.primary.purple}/>
        </Pressable>
        <Pressable onPress={handleSubmit(editTask)} style={{flex:1}}>
          <Feather name="check-circle" size={20} color={colors.primary.purple}/>
        </Pressable>
      </Pressable>
      <View style={{display:time==undefined?"none":"flex",width:60,height:40,justifyContent:'center', alignContent:'center', alignItems:'flex-end'}}>
          <Text style={{fontSize:10, right:10}}>{time=="Invalid date"?undefined: time==undefined? undefined:taskTime}</Text>
      </View>
      <Pressable onPress={()=> updateTaskState()} style={{display:editOn?'none':'flex',marginRight:5}}>
        <MaterialCommunityIcons name={taskState===0 ? 'checkbox-blank-outline' : (
          taskState===1 ? 'checkbox-intermediate' : (
          taskState===2 ? 'checkbox-blank' :
          'arrow-right-bold-box-outline')
        )} size={30} />
      </Pressable>
    </View>
  );
}
export default Task;

