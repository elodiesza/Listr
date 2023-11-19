import { Animated, Easing, Keyboard, FlatList, TextInput, TouchableOpacity, Text, View, Dimensions, Pressable } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Feather, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { container, colors, paleColor } from '../styles';
import Task from './Task';
import Tab from './Tab';
import uuid from 'react-native-uuid';
import { useForm, Controller, set } from 'react-hook-form';
import moment from 'moment';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

function TodayTasks({db, tasks, setTasks, tracks, date, logs, setLogs, selectedTrack, setSelectedTrack}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState(undefined);
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
      Keyboard.dismiss();
    }, [tasks]);

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
  const month = today.getMonth();
  const year = today.getFullYear();
  const day = today.getDate();

  const {control, handleSubmit, reset} = useForm();
  const [logsLoading, setLogsLoading] = useState(true);
  
  useEffect (()=>{
    setLogsLoading(false)
  },[logs])


  const openRowRef = useRef(null);
  const onRowDidOpen = (rowKey,rowMap) => {  
      openRowRef.current = rowMap[rowKey];
  };
  const closeOpenRow = () => {
      if (openRowRef.current && openRowRef.current.closeRow) {
          openRowRef.current.closeRow();
          openRowRef.current = null;
      }
  };

  useEffect (() => {
    if (logsLoading==false){
      if (logs.filter(c=>(c.year==today.getFullYear() && c.month==today.getMonth() && c.day==today.getDate())).length==0) {
        if(logs.length==0) {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO logs (id,year,month,day) values (?,?,?,?)',
          [uuid.v4(),year,month,day],
          (txtObj,resultSet)=> {    
            setLogs([...logs,{ id: uuid.v4(), year: year, month: month, day: day}]);
          },
          (txtObj, error) => console.warn('Error inserting data:', error)
          );
        });
        setLogs([...logs,{ id: uuid.v4(), year: year, month: month, day: day}]);
        setIsLoading(false);
        }
        else {
          let lastyear = logs[logs.length-1].year;
          let lastmonth = logs[logs.length-1].month;  
          let lastday = logs[logs.length-1].day;
          let lastdate = new Date(lastyear,lastmonth,lastday);
          let dategap = Math.floor((today-lastdate)/(1000*60*60*24));
          let nbRecurringtasks = tasks.filter(c=>(c.year==lastyear && c.month==lastmonth && c.day==lastday && c.recurring==1 && c.monthly==false)).length;
          let existingTasks= [...tasks];
          for (var i=0;i<nbRecurringtasks;i++) {
            let tasktocopy = tasks.filter(c=>(c.year==lastyear && c.month==lastmonth && c.day==lastday && c.recurring==1 && c.monthly==false))[i].task;
            let tracktocopy = tasks.filter(c=>(c.year==lastyear && c.month==lastmonth && c.day==lastday && c.recurring==1 && c.monthly==false))[i].track;
            let timetocopy = tasks.filter(c=>(c.year==lastyear && c.month==lastmonth && c.day==lastday && c.recurring==1 && c.monthly==false))[i].time;
            for (var j=1;j<dategap+1;j++) {
              let newyear = new Date(lastyear,lastmonth,lastday+j).getFullYear();
              let newmonth = new Date(lastyear,lastmonth,lastday+j).getMonth();
              let newday = new Date(lastyear,lastmonth,lastday+j).getDate();
              db.transaction((tx) => {
                tx.executeSql('INSERT INTO tasks (id,task,year,month,day,state,recurring, monthly, track, time, section) values (?,?,?,?,?,?,?,?,?,?,?)',
                [uuid.v4(),tasktocopy,newyear,newmonth,newday,0,1,false,tracktocopy,timetocopy,undefined],
                (txtObj,resultSet)=> {    
                  existingTasks.push({ id: uuid.v4(), task: tasktocopy, year:newyear, month:newmonth, day:newday, state:0, recurring:1, 
                    monthly:false, track:tracktocopy, time:timetocopy, section: undefined});
                },
                (txtObj, error) => console.warn('Error inserting data:', error)
                );
              });
              
            }
          }
          setTasks(existingTasks);
          db.transaction((tx) => {
            tx.executeSql('INSERT INTO logs (id,year,month,day) values (?,?,?,?)',
            [uuid.v4(),year,month,day],
            (txtObj,resultSet)=> {    
              setLogs([...logs,{ id: uuid.v4(), year: year, month: month, day: day}]);
            },
            (txtObj, error) => console.warn('Error inserting data:', error)
            );
          });
          setLogs([...logs,{ id: uuid.v4(), year: year, month: month, day: day}]);
          setIsLoading(false);
        }
      }
      else {
        setIsLoading(false);
      }
    }
  },[logs]);
    
  if (isLoading) {
    return (
      <View>
        <Text> Is Loading...</Text>
      </View>
    )
  }


  const addTask = async (data) => {
    let existingTasks = [...tasks]; 
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO tasks (id,task,year,month,day,state,recurring, monthly, track, time, section, creationdate, completiondate, postpone, notes) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [uuid.v4(),data.task,date.getFullYear(),date.getMonth(),date.getDate(),0,0,false,(selectedTrack=='all'||selectedTrack=='tocomplete')?'DAILY':selectedTrack,null,undefined,
      moment(new Date()).format('YYYY-MM-DD'), undefined, 0 , undefined],
      (txtObj,resultSet)=> {    
        existingTasks.push({ id: uuid.v4(), task: data.task, year:date.getFullYear(), month:date.getMonth(), day:date.getDate(), state:0, recurring:0, 
          monthly:false, track:selectedTrack=='all'?'DAILY':selectedTrack, time:null, section: undefined,
          creationdate: moment(new Date()).format('YYYY-MM-DD'), completiondate: undefined, postpone: 0, notes: undefined});
        setTasks(existingTasks);
      },
      (txtObj, error) => console.warn('Error inserting data:', error)
      );
    });
    reset();
  };

  const dailyData = tasks.filter(c=>(c.day==date.getDate() && c.month==date.getMonth() && c.year==date.getFullYear()));
  const tocomplete = tasks.filter(c=>(c.day==date.getDate() && c.month==date.getMonth() && c.year==date.getFullYear() && (c.state==0 || c.state==1)));

  const Unlist = (id) => {
    let existingTasks = [...tasks];
    const toTransfer = existingTasks.map(c=>c.id).findIndex(c=>c==id);
    const thisTrack= existingTasks[toTransfer].track;
    const newTrack= (thisTrack=='DAILY' || thisTrack=='all' || thisTrack==undefined)?'UNLISTED':thisTrack;
    db.transaction(tx=> {
        tx.executeSql('UPDATE tasks SET year = ?, month=?, day=?, track=?, section=? WHERE id= ?', [undefined,undefined,undefined,newTrack,undefined,id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingTasks[toTransfer].year = undefined;
              existingTasks[toTransfer].month = undefined;
              existingTasks[toTransfer].day = undefined;
              existingTasks[toTransfer].track = newTrack;
              existingTasks[toTransfer].section = undefined;
              setTasks(existingTasks);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
    });
    closeOpenRow();
  }


  const TaskSwipeItem = ({ id }) => (
    <View style={{ flex: 1, backgroundColor: 'green', flexDirection: 'row' }}>
        <View style={{ width: 0.9*width -50, paddingRight: 12, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: colors.primary.yellowgreen }}>
            <Pressable onPress={()=>Unlist(id)}>
                <MaterialCommunityIcons name="chevron-left-box-outline" size={25} color={'white'} />
            </Pressable>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'darkred' }}>
            <Pressable onPress={() => 
                {db.transaction(tx=> {
                  tx.executeSql('DELETE FROM tasks WHERE id = ?', [id],
                    (txObj, resultSet) => {
                      if (resultSet.rowsAffected > 0) {
                        let existingTasks = [...tasks].filter(task => task.id !==id);
                        setTasks(existingTasks);
                      }
                    },
                    (txObj, error) => console.log(error)
                  );       
                closeOpenRow();
                })}
                }>
                <Feather name="trash-2" size={25} color={'white'} />
            </Pressable>
        </View>
    </View>
  );


  return (
      <Pressable style={container.body} onPress={handleClickOutside}>
        <View style={container.block}>
          <View style={{zIndex:1, bottom:-1,flexDirection:'row'}}>
            <View style={{flex:1,flexDirection:'row'}}>
              <FlatList
                data={[... new Set(tracks),{'id':'daily','name':'DAILY','color':colors.primary.default}]} 
                renderItem={({item,index}) => 
                  <Tab item={item} selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack}/>
                }
                horizontal={true}
                bounces={true}
                keyExtractor= {(item) => item.index}
                contentContainerStyle={{flexDirection:'row-reverse',paddingLeft:10}}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <Pressable onPress={()=> setSelectedTrack('tocomplete')}>
              <MaterialCommunityIcons name='checkbox-blank-outline' size={23} style={{marginLeft:10,marginTop:3}} color={selectedTrack=='tocomplete'?colors.primary.black:colors.primary.defaultdark}/>
            </Pressable>
            <Pressable onPress={()=> setSelectedTrack('all')}>
              <Octicons name='stack' size={23} style={{marginHorizontal:10,marginTop:3}} color={selectedTrack=='all'?colors.primary.black:colors.primary.defaultdark}/>
            </Pressable>
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
                backgroundColor: colors.primary.white
              }
            ]}
          >
            <View style={{flex:1}}>
              {isLoading==false && logs.filter(c=>(c.year==year && c.month==month && c.day==day))[0]!==undefined &&  (
              <SwipeListView 
                data={selectedTrack=='all'? dailyData : selectedTrack=='DAILY'? dailyData.filter(c=>(c.track==undefined || c.track=='DAILY' || c.track=='UNLISTED')) : selectedTrack=='tocomplete'? tocomplete : dailyData.filter(c=>(c.track==selectedTrack))} 
                scrollEnabled={true} 
                renderItem={({ item,index }) => 
                  <Task db={db} tasks={tasks} setTasks={setTasks} monthly={item.monthly}
                    date={date} task={item.task} state={item.state} id={item.id} track={item.track} 
                    time={item.time} section={item.section} trackScreen={false} recurring={item.recurring} 
                    year={item.year} month={item.month} day={item.day}
                    tabcolor={item.track==undefined? colors.primary.defaultdark:tracks.filter(c=>c.track==item.name).map(c=>c.color)[0]}
                    editIndex={editIndex} setEditIndex={setEditIndex} index={index}
                    selectedSection={item.section} setSelectedSection={setSelectedSection}/>} 
                    renderHiddenItem={({ item }) => <TaskSwipeItem id={item.id} 
                  />
                } 
                bounces={false} 
                onRowDidOpen={onRowDidOpen}
                rightOpenValue={-100}
                disableRightSwipe={true}
                closeOnRowBeginSwipe={true}
                contentContainerStyle={{marginTop:1}}
                keyExtractor= {(item) => item.index}
              /> )}
            </View>
            <View style={{width:'100%',flexDirection:'row', height:40, paddingLeft:15, alignItems:'center', borderTopWidth:1,borderTopColor:colors.primary.gray}}>
              <Controller
                control= {control}
                name="task"
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                  <View style={{flex:1,flexDirection:'column'}}>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Insert new task in this track for this day"
                      style={{flex:1,height:40, borderColor: error ? 'red' : '#e8e8e8'}}
                    />
                    {error && (
                      <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                    )}
                  </View>
                )}
                rules={{
                  required: 'Input a Task',
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
              <Pressable onPress={handleSubmit(addTask)} style={{marginHorizontal:10}}>
                <Feather name="plus-circle" size={20} color={colors.primary.purple}/>
              </Pressable>
            </View>
          </Animated.View>
        </View>
    </Pressable>
  );
}
export default TodayTasks;
