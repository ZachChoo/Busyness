import React, { useEffect, useState } from 'react';
import api from '../Api/api'
//import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";


// from https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var amOrPm = hour > 12 ? 'PM' : 'AM';
  hour = hour > 12 ? hour - 12 : hour;
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes(); 
  var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec + ' ' + amOrPm;
  return time;
}

function Graph(props){
  const [pastBusyness, setPastBusyness] = useState(null);
  const timeout = 3000;
  const interval = 20;

  function updateGraph () {
    var numSoFar = 0;
    var sum = 0;
    var busynessArr = [];
    api.getPastBusynessOfRoom(props.room._id).then(response => {
      for (var i = 0; i < response.data.data.length; i++) {
        sum += response.data.data[i].currBusyness;
        numSoFar++;
        if (i % interval === 0 || i === response.data.data.length - 1) {
          busynessArr.push({currBusyness: Math.round(sum/numSoFar), date: response.data.data[i].date})
          sum = 0;
          numSoFar = 0;
        }
      }
      setPastBusyness(busynessArr.sort((a,b) => {
        return a.date - b.date;
      }));
    })
  }
  
  useEffect(updateGraph, [props.room._id]);

  useEffect(() => {
    const interval = setInterval(updateGraph, timeout);
    return () => clearInterval(interval);
  }, [props.room._id]);

  return (
    <div>
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart width={500} height={400} data={pastBusyness} margin={{top: 10, right: 30, left: 30, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" domain = {['dataMin', 'dataMax']} tickFormatter = {timeConverter} type = 'number'/>
        <YAxis type="number" domain = {[0, 100]}/>
        <Tooltip labelFormatter={function(value) {return timeConverter(value)}} formatter={function(busyPercent) {return busyPercent + '%'}}/>
        <Area type="monotone" dataKey="currBusyness" stroke="#8884d8" fill="#8884d8" name="Busyness"/>
      </AreaChart>
    </ResponsiveContainer>
    </div>
  );
}

export default Graph;