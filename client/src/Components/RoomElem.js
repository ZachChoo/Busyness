import React, { useState } from 'react';
import Graph from './Graph.js';
import LinearProgressWithLabel from './ProgressBar';
import icon from '../Images/icons8-big-32.png'

function RoomElem(props){
    const [showGraph, setShowGraph] = useState(false);
    return (
        <div>
            <div className='flex justify-center'>
                <div className="grid grid-cols-3 gap-10">
                    <div className='place-self-center flex'>
                        <div className='place-self-center mx-3 hover:text-blue-500' onClick={() => setShowGraph(!showGraph)}>Show past busyness</div>
                        <img src={icon} alt='' className='place-self-center w-5' onClick={() => setShowGraph(!showGraph)}/>
                    </div>
                    
                    <div className='font-bold place-self-center'>
                        {props.room.roomName}
                    </div>
                    <div className='place-self-center'>
                        Open until {props.room.closingTime}
                    </div>
                </div>
            </div>

            <div className='flex justify-center'>
                <div className='w-1/2 pl-5 py-3'>   
                    <LinearProgressWithLabel value={props.room.busyness} />
                </div>
            </div>
            <div className='w-full'>
                { showGraph && (<Graph room={props.room}/>) }
            </div>
            
        </div>

    )
}

export default RoomElem;