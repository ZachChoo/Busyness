import React from "react";
import { Parallax, Background } from "react-parallax";
import bgIm from '../Images/0416472.png'

export default function HomeTitle() {
    return (
        <div>
            <Parallax strength={500} >
                <Background className="custom-bg">
                    <div
                    style={{
                        height: 2000,
                        width: 2000,
                        backgroundSize:"contain",
                        backgroundImage: `url(${bgIm})`
                    }}
                    />
                </Background>
                <div className='text-left text-black'>
                    <div className='mx-24 mt-20 lg:mx-20 lg:my-0 text-left text-8xl lg:text-7xl font-bold'>Busyness:</div>
                    <div className='px-20 my-10 lg:my-0 w-full lg:w-2/3 text-center lg:text-left text-7xl font-bold'>Occupancy data monitoring for businesses</div>
                    <div className='mx-20 mt-10 pb-10 w-5/6 text-left text-2xl hidden lg:block'>
                        Especially during a pandemic, occupancy data should be held paramount; 
                        allowing customers to make informed decisions about where to go. 
                        Busyness helps achieve this by estimating the amount of people in a space using wifi.
                    </div>
                </div>
            </Parallax>
        </div>
    );
}