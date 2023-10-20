import { FlatList, TextInput, Button, TouchableOpacity, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useState,useEffect } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Feather } from '@expo/vector-icons';
import NewTask from '../modal/NewTask';
import { container, colors } from '../styles';
import Task from './Task';
import uuid from 'react-native-uuid';
import { useForm, Controller, set } from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

const width = Dimensions.get('window').width;

export default function MonthlyTasks({db, load, loadx, tracks, setTracks, year, month, tasks, setTasks}) {
  
  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth();
  const thisDay = today.getDate();
  const [isLoading, setIsLoading] = useState(true);
  const [mlogs, setMLogs] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const {control, handleSubmit, reset} = useForm();
  const [value, setValue] = useState('');


  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS mlogs (id TEXT PRIMARY KEY, year INTEGER, month INTEGER, UNIQUE(year,month))')
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM mlogs', null,
      (txObj, resultSet) => setMLogs(resultSet.rows._array),
      (txObj, error) => console.log('error selecting mlogs')
      );
    });
    setIsLoading(false);
  },[]);

  
  useEffect(() => {
    if (!isLoading && tasks.filter(c=>c.monthly==true).length > 0 && mlogs.filter(c=>(c.year==year && c.month==month))[0]==undefined) {
      if(mlogs.length > 0){
      let existingLogs = [...mlogs];  
      let lastLogIndex = mlogs.length-1;
      let lastLog = mlogs[lastLogIndex];
        db.transaction(tx => {
          tx.executeSql('INSERT INTO mlogs (id,year,month) values (?,?,?)',[uuid.v4(),year,month],
            (txtObj,resultSet)=> {    
              existingLogs.push({ id: uuid.v4(), year:year, month:month});
              setMLogs(existingLogs);                      
            },
          );
        });

        let existingTasks=[...tasks.filter(c=>c.monthly==true)];

        let existingRecurringTasks=(existingTasks.length==0)? '':existingTasks.filter(c=>(c.recurring==1 && c.year==lastLog.year && c.month==lastLog.month));
        existingLogs=[];

        if (lastLog!==undefined) {

          var monthsBetweenLastAndToday = (year-lastLog.year)*12+(month-lastLog.month);
          for(var j=0;j<monthsBetweenLastAndToday;j++){
            var newDate=new Date(lastLog.year,lastLog.month+j,1);
            for (var i=0; i<existingRecurringTasks.length;i++){    
              let newTask=existingRecurringTasks[i].task;
              let copytrack=existingRecurringTasks[i].track;
              let copyTime=existingRecurringTasks[i].time;
              db.transaction(tx => {
                tx.executeSql('INSERT INTO tasks (id,task,year,month,day,taskState,recurring,monthly,track,time,section) values (?,?,?,?,?,?,?,?,?,?,?)',
                [uuid.v4(),newTask,newDate.getFullYear(),newDate.getMonth(),1,0,1,true,copytrack,copyTime, undefined],
                  (txtObj,resultSet)=> {   
                    existingTasks.push({ id: uuid.v4(), task: newTask, year:newDate.getFullYear(), month:newDate.getMonth(), day:1, taskState:0, recurring:1, monthly: true, track:copytrack, time:copyTime, section:undefined});
                    setTasks(existingTasks);
                  },
                );
              });
            }
          }
          setTasks(existingTasks);
        }
      }
      else {
        let existingLogs = [...mlogs];  
          db.transaction(tx => {
            tx.executeSql('INSERT INTO mlogs (id,year,month) values (?,?,?)',[uuid.v4(),year,month],
              (txtObj,resultSet)=> {    
                existingLogs.push({ id: uuid.v4(), year:year, month:month});
                setMLogs(existingLogs);
              },
            );
          });
      }
    }
  },[isLoading, mlogs]);

  
  const TransferDaily = (id) => {
    let existingTasks = [...tasks];
    let toTransfer = tasks.filter(c=>(c.id==id))[0];
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO tasks (id,task,year,month,day,taskState,recurring,monthly,track,time,section) values (?,?,?,?,?,?,?,?,?,?,?)',
      [ uuid.v4(),toTransfer.task,thisYear,thisMonth,thisDay,toTransfer.taskState,0,false,toTransfer.track,undefined, undefined],
      (txtObj,resultSet)=> {    
        existingTasks.push({ id: uuid.v4(), task: toTransfer.task, year:thisYear, month:thisMonth, day:thisDay, taskState:toTransfer.taskState, recurring:0, monthly: false, track:toTransfer.track, time:undefined, section:undefined});
        setTasks(existingTasks);
      },
      (txtObj, error) => console.warn('Error inserting data:', error)
      );
    })
    db.transaction(tx => {
      tx.executeSql('DELETE FROM tasks WHERE id = ?', [id],
        (txObj, resultSet2) => {
          if (resultSet2.rowsAffected > 0) {
            let existingTasks = [...tasks].filter(task => task.id !== id);
            setTasks(existingTasks);
          }
        },
        (txObj, error) => console.log(error)
      );
    })
  }

  const DeleteItem = ({ id }) => (
    <View style={{ flex: 1, backgroundColor: 'green', flexDirection: 'row' }}>
      <View style={{ width: width - 100, paddingRight: 12, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: 'yellowgreen' }}>
        <Pressable onPress={()=>TransferDaily(id)}>
          <Feather name="calendar" size={25} color={'white'} />
        </Pressable>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'darkred' }}>
        <Pressable onPress={() => 
        db.transaction(tx => {
          tx.executeSql('DELETE FROM tasks WHERE id = ?', [id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                let existingTasks = [...tasks].filter(task => task.id !== id);
                setTasks(existingTasks);
              }
            },
            (txObj, error) => console.log(error)
          );
        })}>
          <Feather name="trash-2" size={25} color={'white'} />
        </Pressable>
      </View>
    </View>
  );

  const addTask = async (data) => {
    let existingTasks = [...tasks]; 
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO tasks (id,task,year,month,day,taskState,recurring, monthly, track, time, section) values (?,?,?,?,?,?,?,?,?,?,?)',
      [uuid.v4(),data.task,year,month,undefined,0,0,1,undefined,null,undefined],
      (txtObj,resultSet)=> {    
        existingTasks.push({ id: uuid.v4(), task: data.task, year:year, month:month, day:undefined, taskState:0, recurring:0, 
          monthly:1, track:undefined, time:null, section: undefined});
        setTasks(existingTasks);
      },
      (txtObj, error) => console.warn('Error inserting data:', error)
      );
    });
    setValue('');
    loadx(!load);
  };


  const dailyData = tasks.filter(c=>(c.year==year && c.month==month && c.monthly==true));

  return (
    <KeyboardAwareScrollView>
      <View style={container.body}>
        <View style={container.block}>
          <View style={container.tab}>
            <Text style={container.tabtext}>
              MONTHLY
            </Text>
          </View>
          <View style={container.tasklistblock}>
            <SwipeListView 
              data={dailyData} 
              scrollEnabled={true} 
              renderItem={({ item }) => <Task db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} setTracks={setTracks} 
              sections={undefined} date={new Date(year,month,1)} task={item.task} taskState={item.taskState} id={item.id} track={undefined} 
              time={undefined} section={undefined} trackScreen={false} archive={false} recurring={item.recurring} tabcolor={undefined}/>} 
              renderHiddenItem={({ item }) => <DeleteItem id={item.id} />} bounces={false} 
              rightOpenValue={-100}
              disableRightSwipe={true}
              closeOnRowBeginSwipe={true}
            />
            <View style={{flexDirection:'row', height:40, paddingLeft:15, alignItems:'center', borderTopWidth:1,borderTopColor:colors.primary.gray}}>
              <Controller
                control= {control}
                name="task"
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                  <>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="New task in this track for this month"
                      style={{width:'100%',height:40, borderColor: error ? 'red' : '#e8e8e8'}}
                    />
                    {error && (
                      <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                    )}
                  </>
                )}
                rules={{
                  required: 'Input a Habit',
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
              <Pressable onPress={handleSubmit(addTask)}>
                <Feather name="plus-circle" size={20} color={colors.primary.purple} style={{right:30}}/>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => setAddModalVisible(true)} style={{justifyContent: 'center', position: 'absolute', bottom:15, right: 15, flex: 1}}>
        <Feather name='plus-circle' size={40} color={colors.primary.purple
        } />
      </ TouchableOpacity> 
      <NewTask
        addModalVisible={addModalVisible===true}
        setAddModalVisible={setAddModalVisible}
        db={db}
        tasks={tasks}
        setTasks={setTasks}
        tracks={tracks}
        track={undefined}
        section={undefined}
        pageDate={undefined}
        tracksScreen={false}
        monthly={true}
      />
    </KeyboardAwareScrollView>
  );
}
