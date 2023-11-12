import { ImageBackground,Pressable, FlatList, Text, View, Dimensions, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { container,colors } from '../styles';
import { Feather } from '@expo/vector-icons';
import background from '../assets/images/design/background.jpg';
import MonthlyTasks from '../components/MonthlyTasks';
import Calendar from '../components/Calendar';
import Statistics from '../components/Statistics';
import Tab from '../components/Tab';

const width = Dimensions.get('window').width;


const Monthly = ({db, tracks, setTracks, tasks, setTasks, sections, settings, mlogs, setmLogs, date, setDate}) => {
  const [isLoading, setIsLoading] = useState(false);

  var thisMonth = date.getMonth();
  var thisYear = date.getFullYear();
  var thisDay = date.getDate();
  const [month,setMonth] = useState(thisMonth);
  const [year,setYear] = useState(thisYear);
  const [day, setDay] = useState(thisDay);
  const [firstMonth, setFirstMonth] = useState(false);
  const [lastMonth, setLastMonth] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(true);
  const [selectedTab, setSelectedTab] = useState('MONTHLY');
  const [selectedTrack, setSelectedTrack] = useState('∞');
  const [editIndex, setEditIndex] = useState(-1);
  const handleClickOutside = () => {
    if (editIndex !== -1) {
      setEditIndex(-1);
    }
  };

  useEffect(() => {
    (selectedTab=='CALENDAR' && selectedTrack=='☀')? setSelectedTrack('∞'):undefined;
  }, [selectedTab]);

  useEffect(() => {
    if (tasks.filter(c=>(c.year==year && c.month==month-1))==undefined) {
      setFirstMonth(true);
    }
    else{
      setFirstMonth(false);
    }
    if (tasks.filter(c=>(c.year==year && c.month==month+1))==undefined) {
      setLastMonth(true);
    }
    else{
      setLastMonth(false);
    }
  },[])

  const LastMonth = () => {
    if (month==0){
      setMonth(11);
      setYear(year-1);
    }
    else {
      setMonth(month-1);
    }
    if (tasks.filter(c=>(c.year==year && c.month==month-2))==""){
      setFirstMonth(true);
    }
    setLastMonth(false);
  };

  const NextMonth = () => {
    if (month==11){
      setMonth(0);
      setYear(year+1);
    }
    else {
      setMonth(month+1);
    }
    if (tasks.filter(c=>(c.year==year && c.month==month+1))==""){
      setLastMonth(true);
    }
    setFirstMonth(false);
  };


  if (isLoading) {
    return (
      <View>
        <Text> Is Loading...</Text>
      </View>
    )
  }


  return (
    <ImageBackground source={background} resizeMode="cover" style={container.container}>
    <SafeAreaView style={container.container}>
      <Pressable style={[container.header,{height:100,top:25}]} onPress={handleClickOutside}>
        <Pressable onPress={displayMonth==true? ()=>LastMonth(tasks): ()=>setYear(year-1)}>
          <Feather name='chevron-left' size={30} style={{right:30}} color={'black'}/>
        </Pressable>
        <Pressable onPress={()=>setDisplayMonth(!displayMonth)} style={{alignItems:'center'}}>
          <Text style={container.headerdate}>{displayMonth==true?moment(new Date(year,1,1)).format('YYYY'):moment(new Date(0,month,1)).format('MMMM')}</Text>
          <Text style={container.headertitle}>{displayMonth==true?moment(new Date(0,month,1)).format('MMMM'):moment(new Date(year,1,1)).format('YYYY')}</Text>
        </Pressable>
        <Pressable onPress={displayMonth==true? ()=>NextMonth(tasks): ()=>setYear(year+1)}>
          <Feather name='chevron-right' size={30} style={{left:30}} color={'black'}/>
        </Pressable>
      </Pressable>
      <View style={{height:50, width:width, justifyContent:'center', alignItems:'center'}}>
        <FlatList
            data={[{'name':'∞','color':'#ffffff'},{'name':'☀','color':'#D3DDDF'},...new Set(tracks)]}
            renderItem={({item}) => (
                <Pressable onPress={()=>setSelectedTrack(item.name)} style={[container.color,{borderColor:selectedTab=='MONTHLY'? colors.primary.gray:selectedTrack==item.name?colors.primary.purple:colors.primary.gray, borderWidth:selectedTab=='MONTHLY'? 1:selectedTrack==item.name?2:1, backgroundColor:item.color, display: selectedTab=='MONTHLY'? 'none':(selectedTab=='CALENDAR' && item.name=='☀')? 'none':'flex'}]}>
                    <Text>{item.name[0]}</Text>
                </Pressable>
            )}
            keyExtractor={item => item.id}
            horizontal={true}
            contentContainerStyle={{height:20}}
        />
      </View>
      <Pressable style={[container.body]} onPress={handleClickOutside}>
        <View style={{zIndex:1, bottom:-1,flexDirection:'row', width:width*0.9}}>
          <View style={{flex:1,flexDirection:'row'}}>
            <FlatList
                data={[{'id':'statistics','name':'STATISTICS','color':colors.primary.defaultdark},{'id':'calendar','name':'CALENDAR','color':colors.primary.purple},{'id':'monthly','name':'MONTHLY','color':colors.primary.default}]} 
                renderItem={({item,index}) => 
                  <Tab item={item} selectedTrack={selectedTab} setSelectedTrack={setSelectedTab}/>
                }
                horizontal={true}
                bounces={true}
                keyExtractor= {(item) => item.index}
                contentContainerStyle={{flexDirection:'row-reverse',paddingLeft:10}}
                showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
        <View style={{display:selectedTab=='MONTHLY'?'flex':'none',width:width}}>
          <MonthlyTasks db={db} tracks={tracks} setTracks={setTracks} year={year} month={month} tasks={tasks} setTasks={setTasks} mlogs={mlogs} setmLogs={setmLogs}/>
        </View>
        <View style={{display:selectedTab=='CALENDAR'?'flex':'none',width:width, flex:1}}>
          <Calendar db={db} tracks={tracks} year={year} month={month} tasks={tasks} selectedTrack={selectedTrack}/>
        </View>
        <View style={{display:selectedTab=='STATISTICS'?'flex':'none',width:width, flex:1, alignItems:'center'}}>
          <Statistics selectedTrack={selectedTrack} year={year} month={month} tasks={tasks}/>
        </View>
      </Pressable>
    </SafeAreaView>
    </ImageBackground>
  );
};


export default Monthly;