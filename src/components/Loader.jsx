import React from 'react'
import { HashLoader, PulseLoader } from 'react-spinners'

function Loader() {
    return (
        <div className='h-screen w-full flex justify-center items-center z-[9999]'>
            <HashLoader color='#003031' size={90} speedMultiplier={.8} />
        </div>
    )
}

export default Loader