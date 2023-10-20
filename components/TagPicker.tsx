import React from 'react';
import { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

const TrackPicker = ({load, loadx, tracks, selectedTrack, setSelectedTrack}) => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);   

    useEffect(() => {

        const merged = [...new Set([{track: 'Add a new track', color: 'white'},...tracks])];
        const trackList = [...new Set(merged.map(c=>c.track))];
        const merged2 = () => {
            const tracks= []
            for(var i=0; i< trackList.length; i++){
                tracks.push({track: trackList[i]})
            }
            return tracks
        }
        let newArray=merged2().map((item) => {
            return {label: item.track, value: item.track}})
        setItems(newArray)
        setSelectedTrack(value)
    }, [load]);
    

    return (
        <>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={()=>(loadx(!load),setOpen(!open))}
                setValue={setValue}
                onSelectItem={()=>(loadx(!load))}
                dropDownDirection="TOP"
            />
        </>
    );
};

export default TrackPicker;
