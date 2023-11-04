import {Modal, Text, Dimensions, FlatList, TouchableWithoutFeedback, TouchableOpacity,View} from 'react-native';
import { container, colors, paleColor } from '../styles';
import moment from 'moment';
import PieChartView from '../components/PieChartView';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function CalendarDate({db, modalVisible, setModalVisible, tasks, year, month, day, tracks}) {

  const thisDayTasks = tasks.filter(c=>(c.year==year && c.month==month && c.day==day));
  const date = new Date(year,month,day);
  const numbertasks = thisDayTasks.length;
  const completionrate = numbertasks==0?0:parseInt((100*(thisDayTasks.filter(c=>c.taskState==2).length*2+thisDayTasks.filter(c=>c.taskState==1).length)/(thisDayTasks.length*2)).toFixed(0));
  const score = (numbertasks==0||completionrate==0)?0:(100*Math.log(thisDayTasks.filter(c=>c.taskState==2).length*2+thisDayTasks.filter(c=>c.taskState==1).length)/Math.log(thisDayTasks.length*2)).toFixed(0);

  const busyscore = () => {
    let days=[... new Set(tasks.map(c=>c.day))].length;
    let busiestday=0;
    for (var i=0; i<days; i++){
      busiestday=tasks.filter(c=>c.day==i).length>busiestday? tasks.filter(c=>c.day==i).length:busiestday;
    }
    return numbertasks/busiestday;
  }
  const busycolor = busyscore()<0.25 ? colors.primary.green : busyscore()<0.5 ? colors.primary.yellowgreen : busyscore()<0.75 ? colors.primary.orange : colors.primary.red;
  const completioncolor = completionrate<25 ? colors.primary.red : completionrate<50 ? colors.primary.orange : completionrate<75 ? colors.primary.yellowgreen : colors.primary.green;

  const RenderTaskItem = (item) => {
    const taskColor = tracks.filter(c=>c.track==item.track).map(c=>c.color)[0];
    return (
      <View style={{width:0.8*width-50,height:20, backgroundColor:item.taskState==0?colors.pale.default:paleColor(taskColor), borderRadius : 5, borderWidth:1, borderColor:item.taskState==0?colors.primary.defaultdark:taskColor, flexDirection:'row' }}>
        <Text style={{display:item.section==undefined?'none':'flex',color:item.taskState==0?colors.primary.defaultdark:taskColor, fontWeight:'bold', marginHorizontal:5}}>{item.section} > </Text>
        <Text style={{color:item.taskState==0?colors.primary.defaultdark:taskColor, marginHorizontal:5}}>{item.task}</Text>
      </View>
    );
  };

  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(false);
    }}
  > 
    <TouchableOpacity onPressOut={() => {
      setModalVisible(false);
      }} 
      activeOpacity={1} style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableWithoutFeedback>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={[container.modal,{backgroundColor:colors.primary.white,justifyContent:'center',alignItems:'center', width:width*0.8}]}>
            <View>
              <Text>{moment(date).format('dddd, MMM Do YYYY')}</Text>
            </View>
            <View style={{flexDirection:'row', margin:10}}>
              <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <Text style={{fontSize:12, color:colors.primary.tungstene, fontWeight:'bold'}}> Number of </Text>
                <Text style={{fontSize:12, color:colors.primary.tungstene, fontWeight:'bold'}}> tasks </Text>
                <Text style={{fontSize:20, color:busycolor, fontWeight:'bold'}}>{numbertasks} </Text>
              </View>
              <View style={{justifyContent:'center',alignItems:'center',flex:1, height:100}}>
                <Text style={{fontSize:12, color:colors.primary.tungstene, fontWeight:'bold'}}> Completion </Text>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <View style={{position:'absolute'}}>
                    <PieChartView series={[numbertasks==0?1:(1-completionrate/100)*numbertasks,completionrate*numbertasks/100]} color={completioncolor} pieWidth={70}/>
                  </View>
                  <Text style={{fontSize:20, color:colors.primary.black, fontWeight:'bold'}}>{completionrate}%</Text>
                </View>
              </View>
              <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <Text style={{fontSize:12, color:colors.primary.tungstene, fontWeight:'bold'}}> Productivity </Text>
                <Text style={{fontSize:12, color:colors.primary.tungstene, fontWeight:'bold'}}> score </Text>
                <Text style={{fontSize:20, color:colors.primary.black, fontWeight:'bold'}}>{score} </Text>
              </View>
            </View>
            <FlatList 
              data={thisDayTasks.filter(c=>c.recurring==0)}
              horizontal={false} 
              renderItem={({item}) => RenderTaskItem(item)} 
              keyExtractor={item => item.id}
              bounces={true} 
              contentContainerStyle={{maxHeight:100}}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>     
    </TouchableOpacity>
  </Modal>
  );
}

