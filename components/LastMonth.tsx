import { FlatList, SafeAreaView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';


const width = Dimensions.get('window').width;

const LastMonth = (states) => {
  var today = new Date();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
  const [month,setMonth] = useState(thisMonth);
  const [year,setYear] = useState(thisYear);

  const [firstMonth, setFirstMonth] = useState(false);
  const [lastMonth, setLastMonth] = useState(false);

    if (month==0){
      setMonth(11);
      setYear(year-1);
    }
    else {
      setMonth(month-1);
    }
    if (month==1){
      if (states.filter(c=>(c.year==year-1 && c.month==11)).length==0) {
        setFirstMonth(true);
      }
      else{
        setFirstMonth(false);
      }
    }
    else {
      if (states.filter(c=>(c.year==year && c.month==month-2)).length==0) {
        setFirstMonth(true);
      }
      else{
        setFirstMonth(false);
      }
    }
    if (month==10){
      if (states.filter(c=>(c.year==year+1 && c.month==0)).length==0) {
        setLastMonth(true);
      }
      else{
        setLastMonth(false);
      }
    }
    else {
      if (states.filter(c=>(c.year==year && c.month==month)).length==0) {
        setLastMonth(true);
      }
      else{
        setLastMonth(false);
      }
    }

}
export default LastMonth;
