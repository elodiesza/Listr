import { Keyboard, FlatList, TextInput, TouchableOpacity, Button, Text, View, Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import NewTask from '../modal/NewTask';
import { Feather, Octicons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { container, colors, paleColor } from '../styles';
import Task from './Task';
import uuid from 'react-native-uuid';
import { useForm, Controller, set } from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

const width = Dimensions.get('window').width;

function TodayTasks({db, tasks, setTasks, tracks, setTracks, load, loadx, date, sections}) {

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

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

  const tabstitles =[... new Set(tracks.map(c => c.track))];
  const tabstitleslength = tabstitles.length;

  const {control, handleSubmit, reset} = useForm();

  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('DAILY');
  const [selectedTabColor, setSelectedTabColor] = useState(selectedTab==undefined? colors.primary.default:tracks.filter(c=>c.track==selectedTab).map(c=>c.color)[0]);
  const [value, setValue] = useState('');

  useEffect(() => {
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS logs (id TEXT PRIMARY KEY, year INTEGER, month INTEGER, day INTEGER, UNIQUE(year,month,day))')
      });
  
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM logs', null,
        (txObj, resultSet) => setLogs(resultSet.rows._array),
        (txObj, error) => console.log('error selecting logs')
        );
      });
      setIsLoading(false);
    },[]);

    useEffect(() => {
      if (!isLoading && tasks.length > 0 && logs.filter(c=>(c.year==year && c.month==month && c.day==day))[0]==undefined) {
        if(logs.length > 0){
          let existingLogs = [...logs]; 
          let lastLogIndex = logs.length-1;
          let lastLog = logs[lastLogIndex]; 
            db.transaction(tx => {
              tx.executeSql('INSERT INTO logs (id,year,month,day) values (?,?,?,?)',[ uuid.v4(),year,month,day],
                (txtObj,resultSet)=> {    
                  existingLogs.push({ id: uuid.v4(), year:year, month:month, day:day});
                  setLogs(existingLogs);                      
                },
              );
            });

            let existingTasks=[...tasks];

            let existingRecurringTasks=(existingTasks.length==0)? '':existingTasks.filter(c=>(c.recurring==1 && c.year==lastLog.year && c.month==lastLog.month && c.day==lastLog.day));
            existingLogs=[];

            if (lastLog!==undefined) {
              var daysBetweenLastAndToday = Math.floor((today.getTime() - new Date(lastLog.year,lastLog.month,lastLog.day).getTime())/(1000*60*60*24));
              for(var j=1;j<daysBetweenLastAndToday+1;j++){
                var newDate= new Date(new Date(lastLog.year,lastLog.month,lastLog.day).getTime()+j*1000*60*60*24);
                for (var i=0; i<existingRecurringTasks.length;i++){    
                  let newTask=existingRecurringTasks[i].task;
                  let copytrack=existingRecurringTasks[i].track;
                  let copyTime=existingRecurringTasks[i].time;
                  db.transaction(tx => {
                    tx.executeSql('INSERT INTO tasks (id,task,year,month,day,taskState,recurring,track,time, section) values (?,?,?,?,?,?,?,?,?,?)',
                    [ uuid.v4(),newTask,newDate.getFullYear(),newDate.getMonth(),newDate.getDate(),0,1,copytrack,copyTime,undefined],
                      (txtObj,resultSet)=> {   
                        existingTasks.push({ id: uuid.v4(), task: newTask, year:newDate.getFullYear(), month:newDate.getMonth(), day:newDate.getDate(), taskState:0, recurring:1, track:copytrack, time:copyTime, section: undefined});
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
          let existingLogs = [...logs];  
          if(existingLogs.filter(c=>(c.year==year && c.month==month && c.day==day))[0]==undefined && isLoading==false){
            db.transaction(tx => {
              tx.executeSql('INSERT INTO logs (id,year,month,day) values (?,?,?,?)',
              [ uuid.v4(),year,month,day],
                (txtObj,resultSet)=> {    
                  existingLogs.push({ id: uuid.v4(), year:year, month:month, day:day});
                  setLogs(existingLogs);
                },
              );
            });
          }
        }
      }
    },[isLoading, logs]);

    if (isLoading) {
      return (
        <View>
          <Text> Is Loading...</Text>
        </View>
      )
  }

  const addLog = () => {
    let existingLogs = [...logs];  
      db.transaction(tx => {
        tx.executeSql('INSERT INTO logs (id,year,month,day) values (?,?,?,?)',[ uuid.v4(),year,month,day-1],
          (txtObj,resultSet)=> {    
            existingLogs.push({ id: uuid.v4(), year:year, month:month, day:day-1});
            setLogs(existingLogs);
          },
        );
      });
  }


  const addTask = async (data) => {
    let existingTasks = [...tasks]; 
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO tasks (id,task,year,month,day,taskState,recurring, monthly, track, time, section) values (?,?,?,?,?,?,?,?,?,?,?)',
      [uuid.v4(),data.task,date.getFullYear(),date.getMonth(),date.getDate(),0,0,false,selectedTab,null,undefined],
      (txtObj,resultSet)=> {    
        existingTasks.push({ id: uuid.v4(), task: data.task, year:date.getFullYear(), month:date.getMonth(), day:date.getDate(), taskState:0, recurring:0, 
          monthly:false, track:selectedTab, time:null, section: undefined});
        setTasks(existingTasks);
      },
      (txtObj, error) => console.warn('Error inserting data:', error)
      );
    });
    setValue('');
    loadx(!load);
  };

  const dailyData = tasks.filter(c=>(c.day==date.getDate() && c.monthly==false));

  const DeleteItem = ({ id }) => (
    <View style={{flex: 1,justifyContent: 'center', alignItems: 'flex-end', paddingRight: 25, backgroundColor:'darkred'}}>
      <Pressable onPress={ () =>
        db.transaction(tx=> {
          tx.executeSql('DELETE FROM tasks WHERE id = ?', [id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                let existingTasks = [...tasks].filter(task => task.id !==id);
                setTasks(existingTasks);
              }
            },
            (txObj, error) => console.log(error)
          );       
        })  
      }>
          <Feather name="trash-2" size={25} color={'white'}/>
      </Pressable> 
    </View>
  );


  return (
    
      <View style={container.body}>
        <View style={container.block}>
          <View style={{flexDirection:'row', width:'100%',zIndex:1}}>
            <View style={{flex:1,flexDirection:'row'}}>
              <FlatList
                data={[... new Set(tracks),{'id':'daily','track':'DAILY','color':colors.primary.default}]} 
                renderItem={({item,index}) => 
                  <Pressable onPress={()=>setSelectedTab(item.track)} style={[container.tab,{zIndex:item.track==selectedTab?1:0,bottom:item.track==selectedTab? -1:0,borderRightWidth:item.track==selectedTab? 1:0,borderLeftWidth:item.track==selectedTab? 1:0,borderTopWidth:item.track==selectedTab? 1:0,backgroundColor:item.color!==""?paleColor(item.color):colors.primary.default}]}>
                    <Text style={container.tabtext}>
                      {item.track}
                    </Text>
                  </Pressable>
                }
                horizontal={true}
                bounces={true}
                keyExtractor= {(item,index) => index.toString()}
                contentContainerStyle={{flexDirection:'row-reverse',justifyContent:'flex-start',alignItems:'flex-end',paddingLeft:10}}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <Pressable onPress={()=> setSelectedTab('all')}>
              <Octicons name='stack' size={23} style={{marginHorizontal:5,marginTop:3}}/>
            </Pressable>
          </View>
          <KeyboardAwareScrollView>
          <View style={[container.tasklistblock,{zIndex:0}]}>
            <SwipeListView 
              data={selectedTab=='all'? dailyData : selectedTab=='DAILY'? dailyData.filter(c=>(c.track==undefined || c.track=='DAILY' || c.track=='UNLISTED')) : dailyData.filter(c=>(c.track==selectedTab))} 
              scrollEnabled={true} 
              renderItem={({ item }) => 
                <Task db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} setTracks={setTracks} 
                  sections={sections} date={date} task={item.task} taskState={item.taskState} id={item.id} track={item.track} 
                  time={item.time} section={item.section} trackScreen={false} archive={false} recurring={item.recurring} tabcolor={item.track==undefined? colors.primary.defaultdark:tracks.filter(c=>c.track==item.track).map(c=>c.color)[0]}/>} 
                  renderHiddenItem={({ item }) => <DeleteItem id={item.id} 
                />} 
              bounces={false} 
              rightOpenValue={-80}
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
                      placeholder="New task in this track for today"
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
          </KeyboardAwareScrollView>
        </View>
        <TouchableOpacity onPress={() => setAddModalVisible(true)} style={{justifyContent: 'center', position: 'absolute', bottom:90, right: 15, flex: 1}}>
          <Feather name='plus-circle' size={40} color={colors.primary.purple} />
        </TouchableOpacity> 
        <NewTask
        addModalVisible={addModalVisible===true}
        setAddModalVisible={setAddModalVisible}
        db={db}
        tasks={tasks}
        setTasks={setTasks}
        tracks={tracks}
        track={undefined}
        section={undefined}
        pageDate={date}
        tracksScreen={false}
        monthly={false}
      />
      </View>
      
    
  );
}
export default TodayTasks;
