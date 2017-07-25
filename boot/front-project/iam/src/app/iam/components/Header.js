// src/components/common/Header.js

import React, {PropTypes} from 'react';  
import { Link } from 'react-router-dom';

const Header = () => {  
  return (
    <nav>
      <Link to="/" >Home</Link>
      {" | "}
      <Link to="/about" >About</Link>
            {" | "}
      <Link to="/account" >Account</Link>
            {" | "}
      <Link to="/stock" >Stock</Link>
    </nav>
  );
};

export default Header; 