import React from 'react';
import {Link} from 'react-router-dom'

function BuildingCard(props){
    return (
        <div className='w-full h-full'>
            <Link to={`/location/${props.building._id}`}>
                <img src={props.building.image} alt={props.building.name} className="card-zoom"/>
            </Link>
            <Link 
                to={`/location/${props.building._id}`}
                className="flex justify-center mt-4 text-3xl lg:text-base"
            >
                { props.building.name }
            </Link>
        </div>
    )
}

export default BuildingCard;