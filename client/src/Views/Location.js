import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Api/api'
import Header from '../Components/Header';
import MobileMenu from '../Components/MobileMenu';
import RoomElem from '../Components/RoomElem';


function Location() {
    const {id} = useParams();
    const [building, setBuilding] = useState(null);
    let content = null;
    let buildingName = null;
    const timeout = 3000;

    function renderRooms () {
        api.getBuildingById(id).then(response => {
            setBuilding(response.data);
        })
    }

    //render right away
    useEffect(renderRooms, [id]);

    //continuously rerender after timeout ms
    useEffect(() => {
        const interval = setInterval(renderRooms, timeout);
        return () => clearInterval(interval);
      }, [id]);
    
    if (building) {
        buildingName = building.data.name;
        content = building.data.rooms.sort((a, b) => a.roomName.localeCompare(b.roomName)).map((room, key) => 
            <div key={key}>
                <RoomElem room={room}/>
            </div>)
    }
    return (
        <div className='h-screen'>
            <Header />
            <MobileMenu />
            <div className='text-black'>
                <div className='text-center text-4xl border-t p-3 pb-8'>{buildingName}</div>
                <div>{content}</div>
            </div>
        </div>
        
    )
}

export default Location;