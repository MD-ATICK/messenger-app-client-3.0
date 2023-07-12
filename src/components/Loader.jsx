import React from 'react'
import { PulseLoader } from 'react-spinners'

function Loader() {
    return (
        <div className=' h-screen w-full flex justify-center items-center bg-white z-[9999]'>
            <PulseLoader color='#003031' />
        </div>
    )
}

export default Loader