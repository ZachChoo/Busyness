import React from 'react';
import { slide as Menu } from 'react-burger-menu'

class MobileMenu extends React.Component {
  showSettings (event) {
    event.preventDefault();
  }

  render () {
    // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
    return (
        <div className='lg:hidden text-3xl'>
            <Menu >
                <a id="home" className="menu-item my-10" href="/">Home</a>
                <a id="about" className="menu-item my-10" href="/about">About</a>
                <a id="contact" className="menu-item my-10" href="/contact">Contact</a>
            </Menu>
        </div>
    );
  }
}

export default MobileMenu