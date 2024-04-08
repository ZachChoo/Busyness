import React, { useEffect, useState } from 'react';
import BuildingCard from '../Components/BuildingCard';
import api from '../Api/api'
import Header from '../Components/Header';
import HomeTitle from '../Components/HomeTitle';
import MobileMenu from '../Components/MobileMenu';

function Home() {
    const [building, setBuilding] = useState(null);
    let content = null;
    const timeout = 3000;

    function renderBuildings() {
        api.getAllBuildings().then(response => {
            setBuilding(response.data);
        })
    }

    //render right away
    useEffect(renderBuildings, []);

    useEffect(() => {
        const interval = setInterval(renderBuildings, timeout);
        return () => clearInterval(interval);
      }, []);
    
    if (building) {
        content = building.data.sort((a, b) => a.name.localeCompare(b.name)).map((building, key) => 
            <div key={key}>
                <BuildingCard building={building}/>
            </div>)
    }
    
    return (
        <div>
            <Header />
            <MobileMenu />
            <HomeTitle />
            <div className='text-black'>
                <div className='text-center text-6xl lg:text-4xl py-3'>Locations</div>
                <div className='font-bold grid grid-cols-1 lg:grid-cols-3 gap-x-20 h-full w-full px-20 py-10'>
                    {content}
                </div>
            </div>
        </div>
    )
}

export default Home;