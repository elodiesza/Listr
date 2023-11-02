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
  const [editIndex, setEditIndex] = useState(-1);
  const handleClickOutside = () => {
    if (editIndex !== -1) {
      setEditIndex(-1);
    }
  };
  
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
  const [logsLoading, setLogsLoading] = useState(true);

  function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }


  useEffect (()=>{
    setLogsLoading(false)
  },[mlogs]);



  useEffect (() => {
      if (mlogs.filter(c=>(c.year==today.getFullYear() && c.month==today.getMonth())).length==0) {
        if(mlogs.length==0) {
          db.transaction((tx) => {
            tx.executeSql('INSERT INTO mlogs (id,year,month) values (?,?,?)',
            [uuid.v4(),year,month],
            (txtObj,resultSet)=> {    
              setmLogs([...mlogs,{ id: uuid.v4(), year: year, month: month}]);
            },
            (txtObj, error) => console.warn('Error inserting data:', error)
            );
          });
          setmLogs([...mlogs,{ id: uuid.v4(), year: year, month: month}]);
          setIsLoading(false);
        }
        else {
          let lastyear = mlogs[mlogs.length-1].year;
          let lastmonth = mlogs[mlogs.length-1].month;  
          let lastdate = new Date(lastyear,lastmonth,1);
          let dategap = monthDiff(lastdate,new Date(year,month,1));
          let nbRecurringtasks = tasks.filter(c=>(c.year==lastyear && c.month==lastmonth && c.recurring==1 && c.monthly==true)).length;
          for (var i=0;i<nbRecurringtasks;i++) {
            let tasktocopy = tasks.filter(c=>(c.year==lastyear && c.month==lastmonth && c.recurring==1 && c.monthly==true))[i].task;
            let tracktocopy = tasks.filter(c=>(c.year==lastyear && c.month==lastmonth && c.recurring==1 && c.monthly==true))[i].track;
            let timetocopy = tasks.filter(c=>(c.year==lastyear && c.month==lastmonth && c.recurring==1 && c.monthly==true))[i].time;
            for (var j=1;j<dategap+1;j++) {
              let newyear = new Date(lastyear,lastmonth+j).getFullYear();
              let newmonth = new Date(lastyear,lastmonth+j).getMonth();
              let existingTasks = [...tasks];
              db.transaction((tx) => {
                tx.executeSql('INSERT INTO tasks (id,task,year,month,day,taskState,recurring, monthly, track, time, section) values (?,?,?,?,?,?,?,?,?,?,?)',
                [uuid.v4(),tasktocopy,newyear,newmonth,undefined,0,1,true,tracktocopy,timetocopy,undefined],
                (txtObj,resultSet)=> {    
                  existingTasks.push({ id: uuid.v4(), task: tasktocopy, year:newyear, month:newmonth, day:undefined, taskState:0, recurring:1, 
                    monthly:true, track:tracktocopy, time:timetocopy, section: undefined});
                },
                (txtObj, error) => console.warn('Error inserting data:', error)
                );
              });
              setTasks(existingTasks);
            }
          }
          db.transaction((tx) => {
            tx.executeSql('INSERT INTO mlogs (id,year,month) values (?,?,?)',
            [uuid.v4(),year,month],
            (txtObj,resultSet)=> {    
              setmLogs([...mlogs,{ id: uuid.v4(), year: year, month: month}]);
            },
            (txtObj, error) => console.warn('Error inserting data:', error)
            );
          });
          setmLogs([...mlogs,{ id: uuid.v4(), year: year, month: month}]);
          setIsLoading(false);
        }
      }
      else {
        setIsLoading(false);
      }

  },[mlogs]);
    

    if (isLoading) {
      return (
        <View>
          <Text> Is Loading...</Text>
        </View>
      )
    }

  
  const TransferDaily = (id) => {
    let existingTasks = [...tasks];
    let indexToUpdate = existingTasks.findIndex(c => c.id === id);
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
      <Pressable style={[container.body]}  onPress={handleClickOutside}>
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
              renderItem={({ item, index }) => <Task db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} setTracks={setTracks} 
              sections={undefined} date={new Date(year,month,1)} task={item.task} taskState={item.taskState} id={item.id} track={undefined} 
              time={undefined} section={undefined} trackScreen={false} archive={false} recurring={item.recurring} tabcolor={undefined} 
              monthly={true} year={item.year} month={item.monthly} day={item.day}
              editIndex={editIndex} setEditIndex={setEditIndex} index={index}/>} 
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
    </Pressable>
  );
}
