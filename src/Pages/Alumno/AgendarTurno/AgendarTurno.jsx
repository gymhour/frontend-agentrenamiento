import React, {useState} from 'react';
import '../../../App.css';
import './agendarTurno.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown';

const AgendarTurno = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const options = ['Opción 1', 'Opción 2', 'Opción 3'];

    return(
        <div className='page-layout'>
            <SidebarMenu isAdmin={false}/>
            <div className='content-layout'> 
                <h2> Agendar turno </h2>
                <div className="agendar-turno-ctn">
                    <CustomDropdown 
                        options={options} 
                        value={selectedOption} 
                        onChange={(e) => setSelectedOption(e.target.value)} 
                    />
                </div>
            </div>
        </div>
    )
}

export default AgendarTurno;