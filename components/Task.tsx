import { TextInput, Text, View, Dimensions, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { MaterialCommunityIcons, Entypo, Feather, Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { container} from '../styles';
import { colors } from '../styles';
import uuid from 'react-native-uuid';
import { useForm, Controller, set } from 'react-hook-form';


function Task({db, tasks, setTasks, date,task, state, id , time, section, trackScreen, recurring, tabcolor, monthly, year, month, day, editIndex, setEditIndex, index, selectedSection, setSelectedSection, track}) {
  
  const {control, handleSubmit, reset} = useForm();
  const [taskInput, setTaskInput] = useState(task);
  const today= new Date();
  const todayDate = moment(today).format("YY-MM-DD");
  const tomorrowDate = moment(new Date(today.setDate(today.getDate()+1))).format("YY-MM-DD");
  const dateDate = moment(date).format("YY-MM-DD");

  useEffect(() => {
    setTaskInput(task);
  }, [task]);

  const updatestate = () => {
    db.transaction(tx=> {
      let existingTasks=[...tasks];
      let indexToUpdate = existingTasks.findIndex(c => c.id === id);
      let postponedTask = existingTasks[indexToUpdate].task;
      let nextDay= date==undefined? undefined:new Date(Math.floor(date.getTime()+(1000*60*60*24)));
      let nextDayYear = date==undefined? undefined:nextDay.getFullYear();
      let nextDayMonth = date==undefined? undefined:nextDay.getMonth();
      let nextDayDay = date==undefined? undefined:nextDay.getDate();
      let copytrack=existingTasks[indexToUpdate].track;
      let copyTime=existingTasks[indexToUpdate].time;
      let copyCreationdate=existingTasks[indexToUpdate].creationdate;
      let copyCompletiondate=existingTasks[indexToUpdate].completiondate;
      let copyPostpone=existingTasks[indexToUpdate].postpone;
      let copyNotes=existingTasks[indexToUpdate].notes;
      if (existingTasks[indexToUpdate].state==0){
        console.warn(existingTasks[indexToUpdate].id, id)
        tx.executeSql('UPDATE tasks SET state = ? WHERE id = ?', [1, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingTasks[indexToUpdate].state = 1;
              console.warn(existingTasks);
              setTasks(existingTasks);
              console.warn(existingTasks);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      }
      else if(existingTasks[indexToUpdate].state==1){
        
          tx.executeSql('UPDATE tasks SET state = ? WHERE id = ?', [2, id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                existingTasks[indexToUpdate].state = 2;
                setTasks(existingTasks);
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        
      }
      else if(existingTasks[indexToUpdate].state==2){
        if (existingTasks[indexToUpdate].recurring==0 && date!==undefined){
          let postponeInc = copyPostpone+1;
          
            tx.executeSql('UPDATE tasks SET state = ? WHERE id = ?', [3, id],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  existingTasks[indexToUpdate].state = 3;
                  setTasks(existingTasks);
                }
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          
          
            tx.executeSql('INSERT INTO tasks (id,task,year,month,day,state,recurring,monthly,track,time, section, creationdate, completiondate, postpone, notes) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [ uuid.v4(),postponedTask,nextDayYear,nextDayMonth,nextDayDay,0,0,false,copytrack,copyTime, section, copyCreationdate, copyCompletiondate, postponeInc, copyNotes],
              (txtObj,resultSet)=> {   
                existingTasks.push({ id: uuid.v4(), task: postponedTask, year: nextDayYear, month:nextDayMonth, day:nextDayDay, state:0, recurring:0, 
                  monthly:false, track:copytrack, time:copyTime, section:section, creationdate:copyCreationdate, completiondate:copyCompletiondate, postpone:postponeInc, notes:copyNotes});
              },
            );
          
        }
        else {
          
            tx.executeSql('UPDATE tasks SET state = ? WHERE id = ?', [0, id],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  existingTasks[indexToUpdate].state = 0;
                  setTasks(existingTasks);
                }
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          
        }
      }
      else {
        
          tx.executeSql('UPDATE tasks SET state = ? WHERE id = ?', [0, id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                existingTasks[indexToUpdate].state = 0;
                setTasks(existingTasks);
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        
        let postponedTaskId = existingTasks.filter(c=>(c.year==nextDayYear && c.month==nextDayMonth && c.day==nextDayDay && c.task==postponedTask)).map(c=>c.id)[0];
        
          tx.executeSql('DELETE FROM tasks WHERE id = ?', [postponedTaskId],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                let existingTasks = [...tasks].filter(task => task.id !==postponedTaskId);
                setTasks(existingTasks);
              }
            },
            (txObj, error) => console.log(error)
          );       
         
      }
    },
    (error) => {
      console.warn('Database transaction error:', error);
    });
  };
  const taskTime= time=="null"? "":moment(time).format('HH:mm');

  const editTask = (data) => { 2
    let existingTasks=[...tasks];
    const indexToUpdate = existingTasks.findIndex(c => c.id === id);
      db.transaction(tx=> {
        tx.executeSql('UPDATE tasks SET task = ? WHERE id = ?', [taskInput, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingTasks[indexToUpdate].task = taskInput;
              setTasks(existingTasks);
            }
          },
          (txObj, error) => console.log('Error updating task', error)
        );
      });
      setEditIndex(-1);
      setTaskInput("");
  };

  return (
    <View style={container.taskcontainer}>
      <View style={{display:(recurring==0 || trackScreen)?"none":"flex",height:40,justifyContent:'center', alignContent:'center', alignItems:'flex-end'}}>
        <Entypo name="cycle" size={20} color={colors.primary.black} />
      </View>
      <View style={{display:(trackScreen && (dateDate==todayDate || dateDate==tomorrowDate))?"flex":"none",height:40,justifyContent:'center', alignContent:'center', alignItems:'flex-end'}}>
        <Feather name="calendar" size={20} color={colors.primary.black} />
      </View>
      <Pressable onLongPress={()=>{setEditIndex(index);setSelectedSection(section);}} style={{flex:6, display: (editIndex==index && selectedSection==section)?'none':'flex'}}>
        <Text style={{marginLeft:5,display:(section==undefined || trackScreen)?"none":"flex",color:tabcolor, fontWeight:'bold'}}>
          {section} >
        </Text>        
        <Text style={container.tasktext}>
          {task}
        </Text>
      </Pressable>
      {editIndex==index && selectedSection==section && 
        <Pressable style={{flex:1, flexDirection:'row', alignItems:'center'}}>   
          <Controller
                control= {control}
                name="task"
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                  <View style={{flexDirection:'column', flex:1}}>
                    <TextInput
                      value={taskInput}
                      onChangeText={(val)=>setTaskInput(val)}
                      onBlur={onBlur}
                      placeholder={task}
                      style={{borderColor: error ? 'red' : '#e8e8e8',height:50,flex:1}}
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
          <Pressable onPress={editTask} style={{height:40, width:60, justifyContent:'center', alignItems:'center',backgroundColor:colors.primary.purple}}>
            <Ionicons name='send' size={20} color={colors.primary.white}/>
          </Pressable>
        </Pressable>
      }
      <View style={{display:time==undefined?"none":"flex",width:60,height:40,justifyContent:'center', alignContent:'center', alignItems:'flex-end'}}>
          <Text style={{fontSize:10, right:10}}>{time=="Invalid date"?undefined: time==undefined? undefined:taskTime}</Text>
      </View>
      <View style={{display:(monthly && day!==null && day!==undefined)?"flex":"none",width:60,height:40,justifyContent:'center', alignContent:'center', alignItems:'flex-end'}}>
          <Text style={{fontSize:10, right:10}}>{moment(new Date(year,month+1,day)).format("MM/DD")}</Text>
      </View>
      <Pressable onPress={()=> updatestate()} style={{display:(editIndex==index && selectedSection==section)?'none':'flex',marginRight:5}}>
        <MaterialCommunityIcons name={state===0 ? 'checkbox-blank-outline' : (
          state===1 ? 'checkbox-intermediate' : (
          state===2 ? 'checkbox-blank' :
          'arrow-right-bold-box-outline')
        )} size={30} />
      </Pressable>
    </View>
  );
}
export default Task;

