import React from 'react';
import Header from '../Components/Header';
import MobileMenu from '../Components/MobileMenu';

export default function About() {
    return (
        <div>
            <Header />
            <MobileMenu />
            <div className='mx-24 mt-20 lg:mx-20 lg:my-10 text-center text-8xl lg:text-7xl '>About Busyness</div>
            <div className="flex justify-items-center text-2xl">
                <div className="m-auto w-1/2">
                    <img src="https://duino4projects.com/wp-content/uploads/2017/09/de1-soc_altera_fpga_development_board_cyclone_v-1.png" />
                    <div className='mb-20'>
                        Have you ever tried to go to a study room, only to find all the seats are taken? Maybe you've walked over to the 
                        coffee shop around the corner, only to be met with a 30 minute wait? Busyness aims to solve these problems by
                        provinding you with real time data about the current capacity of your favourite spots.
                    </div>
                    <img src="https://media-eng.dhakatribune.com/uploads/2020/03/bigstock-wifi-icon-isolated-on-white-ba-339777238-1584201534586.jpg" />
                    <div className='mb-20'>
                        So how does Busyness work? It's a network of edge devices that tracks wifi accesses. Every so often, the devices will scan the area
                        for wifi signals, and it will send that number to our servers. These numbers will be displayed on this website, as well as on a VGA display
                        for businesses to monitor. Busyness also graphs busyness scores from up to one week back, so you can get the full picture.
                    </div>
                    <img src="https://cdn.masterlock.com/product/orig/MLCOM_PROD_1500D_01_Hero.jpg" />
                    <div className='mb-20'>
                        Your privacy is important to us. Busyness will never track you or use your data.
                    </div>
                </div>
            </div>
            
            {/* <div className='text-xl'>Functionality</div> */}
            {/* <div>This project will build a network of edge devices that can help students 
                and location managers determine the busyness levels at different locations 
                across University campuses. The DE1-SoC will represent a prototype of the IoT 
                device that can be installed at different locations to track wifi access points
                and then run algorithms to determine the busyness at different locations. 
                The DE1-SoC will relay the gathered data back to a cloud server over WiFi, 
                which will support an online dashboard for students to view from a browser. 
                Here, patrons will be able to view live busyness scores, as well as historical 
                busyness so they have something to compare it to. The DE1-SoC will also drive a 
                VGA output which will display live busyness metrics to the location managers. 
                A common use case for this is managing capacity at the gym: staff can determine 
                whether or not to let new people in without counting by hand.
            </div>
            <div className='text-xl'>Privacy</div>
            <div>Hashing and stuff blah blah blah
            </div> */}
        </div>
    )
}
