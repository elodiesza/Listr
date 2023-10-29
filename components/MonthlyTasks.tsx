import { Keyboard,Animated, Easing, TextInput, TouchableOpacity, Pressable, Text, View, Dimensions } from 'react-native';
import { useState,useEffect } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Feather } from '@expo/vector-icons';
import NewTask from '../modal/NewTask';
import { container, colors } from '../styles';
import Task from './Task';
import uuid from 'react-native-uuid';
import { useForm, Controller, set } from 'react-hook-form';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function MonthlyTasks({db, load, loadx, tracks, setTracks, year, month, tasks, setTasks, mlogs, setmLogs}) {
  
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const openKeyboardAnimationValue = new Animated.Value(0);
  const closeKeyboardAnimationValue = new Animated.Value(1);
  
    const startOpenAnimation = () => {
      Animated.timing(openKeyboardAnimationValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    };
    
    const startCloseAnimation = () => {
      Animated.timing(closeKeyboardAnimationValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    };

    useEffect(() => {
      if (isKeyboardOpen) {
        startOpenAnimation();
      } else {
        startCloseAnimation();
      }
    }, [isKeyboardOpen]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardOpen(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const today = new Date();
  const thisDay = today.getDate();
  const [isLoading, setIsLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const {control, handleSubmit, reset} = useForm();

  
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
              setmLogs(existingLogs);                      
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
                [uuid.v4(),newTask,newDate.getFullYear(),newDate.getMonth(),null,0,1,true,copytrack,copyTime, undefined],
                  (txtObj,resultSet)=> {   
                    existingTasks.push({ id: uuid.v4(), task: newTask, year:newDate.getFullYear(), month:newDate.getMonth(), day:null, taskState:0, recurring:1, monthly: true, track:copytrack, time:copyTime, section:undefined});
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
                setmLogs(existingLogs);
              },
            );
          });
      }
    }
    setIsLoading(false);
  },[]);

  
  const TransferDaily = (id) => {
    let existingTasks = [...tasks];
    let indexToUpdate = existingTasks.findIndex(c => c.id === id);
    let toTransfer = tasks.filter(c=>(c.id==id))[0];

    db.transaction(tx=> {
      tx.executeSql('UPDATE tasks SET day = ? WHERE id = ?', [thisDay, id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            existingTasks[indexToUpdate].day = thisDay;
            setTasks(existingTasks);
          }
        },
        (txObj, error) => console.log('Error updating data', error)
      );
    });
  }

  const DeleteItem = ({ id }) => (
    <View style={{ flex: 1, backgroundColor: 'green', flexDirection: 'row' }}>
      <View style={{ width: width*0.9 - 50, paddingRight: 12, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: 'yellowgreen' }}>
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
      [uuid.v4(),data.task,year,month,undefined,0,0,true,undefined,null,undefined],
      (txtObj,resultSet)=> {    
        existingTasks.push({ id: uuid.v4(), task: data.task, year:year, month:month, day:undefined, taskState:0, recurring:0, 
          monthly:true, track:undefined, time:null, section: undefined});
        setTasks(existingTasks);
      },
      (txtObj, error) => console.warn('Error inserting data:', error)
      );
    });
    reset();
    loadx(!load);
  };


  const dailyData = tasks.filter(c=>(c.year==year && c.month==month && c.monthly==true));

  return (
      <View style={[container.body,{}]}>
        <View style={container.block}>
          <View style={container.tab}>
            <Text style={container.tabtext}>
              MONTHLY
            </Text>
          </View>
          <Animated.View
            style={[
              container.listblock,
              {
                marginBottom: isKeyboardOpen
                  ? openKeyboardAnimationValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, height * 3 / 10],
                    })
                  : closeKeyboardAnimationValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height * 3 / 10, 0],
                    }),
                backgroundColor: colors.primary.white,
              },
            ]}
          >
            <SwipeListView 
              data={dailyData} 
              scrollEnabled={true} 
              renderItem={({ item }) => <Task db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} setTracks={setTracks} 
              sections={undefined} date={new Date(year,month,1)} task={item.task} taskState={item.taskState} id={item.id} track={undefined} 
              time={undefined} section={undefined} trackScreen={false} archive={false} recurring={item.recurring} tabcolor={undefined} monthly={true} year={item.year} month={item.monthly} day={item.day}/>} 
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
                  <View style={{flex:1, flexDirection:'column'}}>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Insert new task in this track for this month"
                      style={{width:'100%',height:40, borderColor: error ? 'red' : '#e8e8e8'}}
                    />
                    {error && (
                      <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                    )}
                  </View>
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
                <Feather name="plus-circle" size={20} color={colors.primary.purple} style={{right:10}}/>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      
      <TouchableOpacity onPress={() => setAddModalVisible(true)} style={{justifyContent: 'center', position: 'absolute', bottom:55, right: 15, flex: 1}}>
        <Feather name='plus-circle' size={40} color={colors.primary.purple} />
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
    </View>
  );
}
