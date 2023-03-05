import logo from './logo.svg';
import './App.css';
import { TextField, Button,} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {useEffect, useState} from 'react'
import PropTypes from 'prop-types';
import { RESPONSEDATA } from './data';

import {
  Scheduler,
  DayView,
  WeekView,
  Appointments,
  Toolbar,
  ViewSwitcher
} from "@devexpress/dx-react-scheduler-material-ui";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

  
function App() {
  const [fixedItems, setFixedItems] = useState([])
  const [floatItems, setFloatItems] = useState([])
  const [items, setItems] = useState([])
  const [itemName, setItemName] = useState('')
  const [itemDate, setItemDate] = useState('')
  const [itemTime, setItemTime] = useState('')
  const [itemDur, setItemDur] = useState('')
  const [itemPriority, setItemPriority] = useState('')
  const [itemOccur, setItemOccur] = useState('')
  const [itemPref, setItemPref] = useState('')
  const [itemFName, setItemFName] = useState('')
  const [itemFDur, setItemFDur] = useState('')
  const [itemFTime, setItemFTime] = useState('')
  const [itemFOccur, setItemFOccur] = useState('')
  const [itemFPref, setItemFPref] = useState('')
  const [panel, setPanel] = useState(0)
  const [APPOINTMENT, SETAPPOINTMENT] = useState([])
  const [fixedBlocks, setFixedBlocks] = useState([])

  useEffect(()=>{
  },[items])

  function iterateRes(){
    RESPONSEDATA.data[0].Monday.forEach(element => {
      let toAdd = createResponseData(element.title, element.time, element.duration, "M")
      setItems(items => [...items, toAdd]);
    });
   
    RESPONSEDATA.data[1].Tuesday.forEach(element => {
      let toAdd = createResponseData(element.title, element.time, element.duration, "T")
      setItems(items => [...items, toAdd]);
    });
    RESPONSEDATA.data[2].Wednesday.forEach(element => {
      let toAdd = createResponseData(element.title, element.time, element.duration, "W")
      setItems(items => [...items, toAdd]);
    });
    RESPONSEDATA.data[3].Thursday.forEach(element => {
      let toAdd = createResponseData(element.title, element.time, element.duration, "TH")
      setItems(items => [...items, toAdd]);
    });
    RESPONSEDATA.data[4].Friday.forEach(element => {
      let toAdd = createResponseData(element.title, element.time, element.duration, "F")
      setItems(items => [...items, toAdd]);
    });
   
  }
  function createResponseData(title, time, dur, day){

   
    let startHour = time.substring(0,2)
    let startMin = time.substring(2,4)
   
    let endHour = Number(startHour) + Math.floor(Number(Number(startMin) + Number(dur)) / 60)
   
    let endmin = (Number(startMin) + Number(dur))
    
    console.log("ENDDDDDMINNNNNNNNNN", endmin)
    while(endmin >= 60){
      endmin = endmin -60;
    }
    if(endmin == 0){
      endmin = "00"
    }
    console.log("endmin is", endmin)

    if(Number(endHour) < 10){
      endHour = "0" + Number(endHour);
    }

    let end = "" + endHour + endmin
    console.log("ENDDDDD", end)

    console.log("STARTH", startHour)
    console.log("STARTM", startMin)
    console.log("ENDH", Math.floor(endHour))
    console.log("ENDM", startMin)

    let date = 23
    if(day == "M"){
      date = 23
    }
    else if( day == "T"){
      date = 24
    }
    else if( day == "W"){
      date = 25
    }
    else if( day == "TH"){
      date = 26
    }
    else if( day == "F"){
      date = 27
    }

    return {title: title, startDate: new Date(2018,6,date,Number(startHour),Number(startMin)), endDate: new Date(2018,6,date,Math.floor(endHour), Number(endmin)), dur: dur, day:day, startTime:time, endTime:end}

  }

  function handleNameInput(val){
    setItemName(val.target.value)
  }


  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function parseFloatItems(){
    let json_arr = [];
    let item_Arr = floatItems.split(";")
    for(let i  = 0; i < item_Arr.length; i++){
      if(item_Arr[i] != ""){
      let item_comp = item_Arr[i].trim().split(",");
      let new_Data = {title:item_comp[0].trim(), dur:item_comp[1].trim(), priority:item_comp[2].trim(), preference: item_comp[3].trim()}
      json_arr.push(new_Data);
      }
    }
    json_arr.sort(GetSortOrder('priority'))
    console.log(json_arr)
    putFloatToSchedule(json_arr)
  }

  function putFloatToSchedule(json_arr){
    let Mondaysch = [];
    let Tuesdaysch = [];
    let Wednesdaysch = [];
    let Thursdaysch = [];
    let Fridaysch = [];

    for(let i = 0; i <96; i++){
      Mondaysch.push(0);
      Tuesdaysch.push(0);
      Wednesdaysch.push(0);
      Thursdaysch.push(0);
      Fridaysch.push(0);
    }

    items.forEach(element => {
      let startH = element.startTime.substring(0,2)
        let startM = element.startTime.substring(2,4)
        console.log("ENDDDDDMIN", element.endTime)
        let endH = element.endTime.substring(0,2)
        let endM = element.endTime.substring(2,4)

        console.log("STARTH", startH)
        console.log("STARTM", startM)
       
        console.log("ENDH", endH)
        console.log("ENDM", endM)

        let startIndex = Number(Number(startH)*4 + Number(startM)/15)
        let endIndex = Number(Number(endH)*4 + Number(endM)/15)

      if(element.day =="M"){
        Mondaysch[startIndex]++;
        Mondaysch[endIndex]--;
      }
      else if(element.day =="T"){
        Tuesdaysch[startIndex]++;
        Tuesdaysch[endIndex]--;
      }
      else if(element.day =="W"){
        Wednesdaysch[startIndex]++;
        Wednesdaysch[endIndex]--;
      }
      else if(element.day =="TH"){
        Thursdaysch[startIndex]++;
        Thursdaysch[endIndex]--;
      }
      else if(element.day =="F"){
        Fridaysch[startIndex]++;
        Fridaysch[endIndex]--;
      }
    });

    console.log(Mondaysch)

    let sum = 0;
    console.log("elemens", json_arr)
   
    json_arr.forEach(element => {
      console.log("TIME NEEDED", Number(element.dur)/15);
      console.log("ITEMMMMMMM", element.title)
      let timeneeded = element.dur;
      let slotsNeeded = timeneeded/15;
      let foundStart = false;
      
      let slotFound = false
      let preferenceStart;
      console.log("PREFERENCEEEEE",element.preference)
      if(element.preference.trim() == "morning"){
       preferenceStart = 32
      }
      else if(element.preference.trim() == "afternoon"){
        preferenceStart = 48
      }
      else{
        preferenceStart = 72
      }
      let availStartIndex = preferenceStart;
  
      for(let k = preferenceStart; k < Mondaysch.length; k++){
        console.log("At index: " + k + " starting index is: " + availStartIndex);
        console.log((k - availStartIndex == slotsNeeded));

        sum += Mondaysch[k];
        if(sum == 0 && !foundStart){
          console.log("Found start at ", k)
          foundStart = true;
          availStartIndex = k
        }
        else if(sum != 0){
          console.log("lost start at ", k)
          foundStart = false;
        }
        else if((k - availStartIndex == slotsNeeded) && foundStart){
          console.log("adding")
          foundStart = false;
          let startH = "" + Math.floor(availStartIndex*15/60) < 10 ? "0"+ Math.floor(availStartIndex*15/60) :  Math.floor(availStartIndex*15/60);
          let startM = Number((availStartIndex*15)%60) == 0 ? "00" : Number((availStartIndex*15)%60);
          let startTime = "" + startH + startM;
          let endH = "" + Math.floor(k*15/60) < 10 ? "0"+ Math.floor(k*15/60) :  Math.floor(k*15/60);
          let endM = Number((k*15)%60) == 0 ? "00" : Number((k*15)%60);
          let endTime = "" + endH + endM
          slotFound = true
          Mondaysch[availStartIndex]++
          Mondaysch[k-1]--
          let toAdd = {title: element.title, startDate: new Date(2018,6,23,Math.floor(availStartIndex*15/60),(availStartIndex*15)%60), endDate: new Date(2018,6,23,Math.floor(k*15/60), (k*15)%60), dur: (k-availStartIndex)*15, day:"M", startTime: startTime, endTime: endTime}
          console.log(toAdd)

          setItems(items => [...items, toAdd]);
          break;
        }
      }
      if(slotFound == false){
        let availStartIndex = 32
        let sum = 0;
      for(let k = 32; k < preferenceStart; k ++){
       
        console.log("At index: " + k + " starting index is: " + availStartIndex);

        console.log((k - availStartIndex == slotsNeeded));

        sum += Mondaysch[k];
        if(sum == 0 && !foundStart){
          console.log("Found start at ", k)
          foundStart = true;
          availStartIndex = k
        }
        else if(sum != 0){
          console.log("lost start at ", k)
          foundStart = false;
        }
        else if((k - availStartIndex == slotsNeeded) && foundStart){
          console.log("ADDDDDDDDDDDDDDDDDDDD", element.title)
          foundStart = false;
          let startH = "" + Math.floor(availStartIndex*15/60) < 10 ? "0"+ Math.floor(availStartIndex*15/60) :  Math.floor(availStartIndex*15/60);
          let startM = Number((availStartIndex*15)%60) == 0 ? "00" : Number((availStartIndex*15)%60);
          let startTime = "" + startH + startM;
          let endH = "" + Math.floor(k*15/60) < 10 ? "0"+ Math.floor(k*15/60) :  Math.floor(k*15/60);
          let endM = Number((k*15)%60) == 0 ? "00" : Number((k*15)%60);
          let endTime = "" + endH + endM
          
          slotFound= true;
          let toAdd = {title: element.title, startDate: new Date(2018,6,23,Math.floor(availStartIndex*15/60),(availStartIndex*15)%60), endDate: new Date(2018,6,23,Math.floor(k*15/60), (k*15)%60), dur: (k-availStartIndex)*15, day:"M", startTime: startTime, endTime: endTime}
          console.log(toAdd)
 
          Mondaysch[availStartIndex]++
          Mondaysch[k-1]--
          setItems(items => [...items, toAdd]);
          break;
        }
      }
    }


    //Tuesday
    if(slotFound == false){
      sum = 0
      console.log("GOING INTO TUESDAYYYYYYYY")
      console.log("PREFERENCEEEEE",element.preference)
      if(element.preference.trim() == "morning"){
       preferenceStart = 32
      }
      else if(element.preference.trim() == "afternoon"){
        preferenceStart = 48
      }
      else{
        preferenceStart = 72
      }
      availStartIndex = preferenceStart;
  
      for(let k = preferenceStart; k < Tuesdaysch.length; k++){
        console.log("At index: " + k + " starting index is: " + availStartIndex);
        console.log((k - availStartIndex == slotsNeeded));

        sum += Tuesdaysch[k];
        if(sum == 0 && !foundStart){
          console.log("Found start at ", k)
          foundStart = true;
          availStartIndex = k
        }
        else if(sum != 0){
          console.log("lost start at ", k)
          foundStart = false;
        }
        else if((k - availStartIndex == slotsNeeded) && foundStart){
          console.log("adding")
          foundStart = false;
          let startH = "" + Math.floor(availStartIndex*15/60) < 10 ? "0"+ Math.floor(availStartIndex*15/60) :  Math.floor(availStartIndex*15/60);
          let startM = Number((availStartIndex*15)%60) == 0 ? "00" : Number((availStartIndex*15)%60);
          let startTime = "" + startH + startM;
          let endH = "" + Math.floor(k*15/60) < 10 ? "0"+ Math.floor(k*15/60) :  Math.floor(k*15/60);
          let endM = Number((k*15)%60) == 0 ? "00" : Number((k*15)%60);
          let endTime = "" + endH + endM
          slotFound = true
          Tuesdaysch[availStartIndex]++
          Tuesdaysch[k-1]--
          let toAdd = {title: element.title, startDate: new Date(2018,6,24,Math.floor(availStartIndex*15/60),(availStartIndex*15)%60), endDate: new Date(2018,6,24,Math.floor(k*15/60), (k*15)%60), dur: (k-availStartIndex)*15, day:"T", startTime: startTime, endTime: endTime}
          console.log("TOADDDD")
          console.log(toAdd)

          setItems(items => [...items, toAdd]);
          break;
        }
      }
      if(slotFound == false){
        let availStartIndex = 32
        let sum = 0;
      for(let k = 32; k < preferenceStart; k ++){
       
        console.log("At index: " + k + " starting index is: " + availStartIndex);

        console.log((k - availStartIndex == slotsNeeded));

        sum += Tuesdaysch[k];
        if(sum == 0 && !foundStart){
          console.log("Found start at ", k)
          foundStart = true;
          availStartIndex = k
        }
        else if(sum != 0){
          console.log("lost start at ", k)
          foundStart = false;
        }
        else if((k - availStartIndex == slotsNeeded) && foundStart){
          console.log("ADDDDDDDDDDDDDDDDDDDD", element.title)
          foundStart = false;
          let startH = "" + Math.floor(availStartIndex*15/60) < 10 ? "0"+ Math.floor(availStartIndex*15/60) :  Math.floor(availStartIndex*15/60);
          let startM = Number((availStartIndex*15)%60) == 0 ? "00" : Number((availStartIndex*15)%60);
          let startTime = "" + startH + startM;
          let endH = "" + Math.floor(k*15/60) < 10 ? "0"+ Math.floor(k*15/60) :  Math.floor(k*15/60);
          let endM = Number((k*15)%60) == 0 ? "00" : Number((k*15)%60);
          let endTime = "" + endH + endM
          

          let toAdd = {title: element.title, startDate: new Date(2018,6,24,Math.floor(availStartIndex*15/60),(availStartIndex*15)%60), endDate: new Date(2018,6,24,Math.floor(k*15/60), (k*15)%60), dur: (k-availStartIndex)*15, day:"M", startTime: startTime, endTime: endTime}
          console.log(toAdd)
 
          Tuesdaysch[availStartIndex]++
          Tuesdaysch[k-1]--
          setItems(items => [...items, toAdd]);
          break;
        }
      }
    }
  }
   

    });
    



  }

  function GetSortOrder(prop) {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return 1;    
        } else if (a[prop] < b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
}   


  function createData(name, date, time, dur, pri, occur, pref, fixed) {
    console.log("DURRR", dur);
    let start = time.split(":")
    console.log("Start hour", start[0])
    console.log("Start min", start[1])
    let endHour = Number(start[0]) + Number(Number(Number(start[1]) + Number(dur)) / 60)
    console.log("End hour", Math.floor(endHour))
    let endmin = (Number(start[1]) + Number(dur)) % 60
    let datev = date.split("-")
   
    
    // return {title:'name', startDate: new Date(2018, 6,25, time.split(":")[0], time.split(":")[1]), endDate: new Date(2018,6,25, endhour, endmin)};
    return {
          title: name,
          startDate: new Date(2018, datev[0], datev[1], start[0], start[1]),
          endDate: new Date(2018, datev[0], datev[1], endHour, endmin),
          duration: dur
        }
  }

  function addData(){
    let data = createData(itemName, itemDate, itemTime, itemDur, itemPriority, itemOccur, itemPref,0);

    console.log(data)
    setFixedItems(fixedItems => [...fixedItems, data])
    setItems(items => [...items,data] );
    
  }

  function addFData(){
    let data = createData(itemFName, itemFTime, itemFDur, itemPriority, itemOccur, itemPref, 1);

    console.log(data)

    setItems(items => [...items,data] );
    
  }

  const handleChange = (event, newValue) => {
    setPanel(newValue);
  };

  // const rows = [
  //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  //   createData('Eclair', 262, 16.0, 24, 6.0),
  //   createData('Cupcake', 305, 3.7, 67, 4.3),
  //   createData('Gingerbread', 356, 16.0, 49, 3.9),
  // ];

  function deleteItem(title){
    setFixedItems((current) =>
      current.filter((fixedItems) => fixedItems.title !== title)
    );
    setItems((current) =>
      current.filter((items) => items.title !== title)
    );
  }

  return (
    <div style={{flex:1, display:'flex', flowDirection:'row', height: '100vh', paddingTop:'2vh',}}>
      <div style={{flex: 1, }}>
      <Button  onClick={iterateRes} variant='contained' >Generate</Button>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom:'2vh' }}>
        <Tabs value={panel}  aria-label="basic tabs example">
          <Tab  label="Schedule" onClick={()=> setPanel(0)} />
          <Tab  label="Fixed" onClick={()=> setPanel(1)}/>
        
        </Tabs>
      </Box>
      
      {/* <TabPanel value={panel} index={1}> */}
     {panel == 1 ? 
      <>
        <div style={{justifyContent:'center', flex: 1, alignItems:'center', display:'flex',}}>
          <TextField onChange={(event)=>setItemName(event.target.value)} variant="outlined" color="primary" label="Fixed Event"/>
          <TextField onChange={(event)=>setItemDate(event.target.value)} style={{marginLeft:'1vw'}} variant="outlined" color="primary" label="Date"/>
          <TextField onChange={(event)=>setItemTime(event.target.value)} style={{marginLeft:'1vw'}} variant="outlined" color="primary" label="Time"/>
          <TextField onChange={(event)=>setItemDur(event.target.value)} style={{marginLeft:'1vw'}} variant="outlined" color="primary" label="Duration"/>
          {/* <TextField onChange={(event)=>setItemPriority(event.target.value)} style={{marginLeft:'1vw'}} variant="outlined" color="primary" label="Priority"/>
          <TextField onChange={(event)=>setItemPref(event.target.value)}style={{marginLeft:'1vw'}} variant="outlined" color="primary" label="Preference"/>
          <TextField onChange={(event)=>setItemOccur(event.target.value)}style={{marginLeft:'1vw'}} variant="outlined" color="primary" label="Occurance"/> */}

          <Button onClick={addData} style={{marginLeft:'1vw', height: '100%'}} variant="contained">Upload</Button>
        </div>
      <TableContainer component={Paper} style={{marginTop:'2vh'}}>
      <Table sx={{ minWidth: 600 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell align="right">Duration (mins)</TableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
          {fixedItems.map((row) => (
            <TableRow
              key={row.title}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell align="right">{row.duration}</TableCell>

              <TableCell align="right">{row.occur}</TableCell>
              <TableCell  align="right">
                <Button onClick={()=>deleteItem(row.title)} style={{backgroundColor:'red', color:'white'}} variant='error'>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
    :
    <>
      <div style={{justifyContent:'center', flex: 1, alignItems:'center', display:'flex', flexDirection:'column'}}>
        <TextField onChange={(event)=>setFloatItems(event.target.value)} rows={5} multiline fullWidth variant='outlined'/>
        <Button onClick={()=>parseFloatItems(floatItems)} style={{marginLeft:'1vw', height: '100%', marginTop:'3vh'}} variant="contained">Upload</Button>
      </div>
      <TableContainer component={Paper} style={{marginTop:'2vh'}}>
      <Table sx={{ minWidth: 600 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell align="right">Duration (mins)</TableCell>
            <TableCell align="right">Priority</TableCell>
            <TableCell align="right">Preference</TableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
          {fixedItems.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell align="right">{row.dur}</TableCell>
              <TableCell align="right">{row.priority}</TableCell>
              <TableCell align="right">{row.priority}</TableCell>
              <TableCell align="right">{row.occur}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
          }
      {/* </TabPanel> */}
     
      </div>
      
      <div style={{flex: 1, display:'flex', backgroundColor:'red' }} >
      <Paper>
        <Scheduler
          data={items}
          height={750}
          
        >
          <ViewState
            defaultCurrentDate="2018-07-25"
            defaultCurrentViewName="Week"
          />

          <DayView
            startDayHour={9}
            endDayHour={18}
          />
          <WeekView
            startDayHour={7}
            endDayHour={24}
          />

          <Toolbar />
          <ViewSwitcher />
          <Appointments />
        </Scheduler>
      </Paper>
      </div>
    </div>
  );
}

export default App;
