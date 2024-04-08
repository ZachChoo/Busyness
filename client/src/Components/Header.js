import { motion } from "framer-motion";
import React, { useState } from "react";
import {Link} from 'react-router-dom'

const Underline = () => (
  <motion.div
    className="absolute -bottom-1 left-0 right-0 h-1 bg-white"
    layoutId="underline"
    layout
  ></motion.div>
);

const Header = () => {
  return (
    <div className="w-full bg-black text-white sticky top-0 opacity-100 hidden lg:block z-10">
      <motion.div className="py-3 flex justify-center">
        <Link to={'/'}>
          <MenuItem text={"Home"}></MenuItem>
        </Link>
        <Link to={'/about'}>
          <MenuItem text={"About"}></MenuItem>
        </Link>
        <Link to={'/contact'}>
          <MenuItem text={"Contact"} ></MenuItem>
        </Link>
      </motion.div>
    </div>
  );
};

const MenuItem = ({ text, children, ...props }) => {
  const [isBeingHovered, setIsBeingHovered] = useState(false);

  return (
    <motion.div
      className="px-10 relative cursor-pointer"
      onHoverStart={() => setIsBeingHovered(true)}
      onHoverEnd={() => setIsBeingHovered(false)}
    >
      <span className="relative">
        {text}
        {isBeingHovered && <Underline />}
      </span>
    </motion.div>
  );
};

export default Header;