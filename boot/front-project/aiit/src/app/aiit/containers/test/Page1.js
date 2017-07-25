import React from 'react';
import {Link} from 'react-router-dom';
const Page1 = () => (
    <div>
        <h1>This is page1!</h1>
        <ul>
            <li><Link to={`/`}>首页</Link></li>


        </ul>
    </div>
);
export default Page1;
