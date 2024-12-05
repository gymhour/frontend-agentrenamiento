import React from 'react';
import './primaryButton.css';
import { Link } from 'react-router-dom';

const PrimaryButton = ({ text, icon: Icon, linkTo }) => {
    return (
        <Link to={linkTo} className="primary-button"> 
            {text}
            {Icon && <Icon className="icon" />} 
        </Link>
    );
};

export default PrimaryButton;
