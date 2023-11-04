import {View} from 'react-native';
import Swiper from 'react-native-swiper'
import MonthlyTasks from './MonthlyTasks';
import { container, colors } from '../styles';
import AnalyticsHome from '../screens/Analytics/AnalyticsHome';
import Calendar from './Calendar';

export default function MonthlyStack({year, month, tasks, tracks, setTracks, load, loadx, db, setTasks, mlogs, setmLogs}) {


  return (
    <View style={container.body}>
        <Swiper horizontal={false} showsButtons={false} showsPagination={false} loop={false} index={0}>
          <MonthlyTasks db={db} load={load} loadx={loadx} tracks={tracks} setTracks={setTracks} year={year} month={month} tasks={tasks} setTasks={setTasks} mlogs={mlogs} setmLogs={setmLogs}/>
          <Calendar db={db} tracks={tracks} year={year} month={month} tasks={tasks}/>
          <AnalyticsHome db={db} tracks={tracks} year={year} month={month} tasks={tasks}/>
        </Swiper>
    </View>
  );
}

