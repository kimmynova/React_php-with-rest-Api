import React from 'react'
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
const Total_display = () => {
  return (
    <div className='flex flex-col gap-4 dark:text-black'>
      <div className='border bg-[white] w-[280px] h-[80px] flex items-center'>
      
        <div className='bg-[#2980b9] text-white w-[80px] h-[100%] flex items-center justify-center'>
          <p className=' text-[50px]'>$</p>
        </div>
        <div className='p-2'>
        <h1>DALY SALLES</h1>
        <span >$ 0</span>
      </div>
      </div>
      <div className='border bg-[white] w-[280px] h-[80px] flex items-center'>
        <div className='bg-[#2980b9] text-white w-[80px] h-[100%] flex items-center justify-center'>
          <p className=' text-[50px]'>$</p>
        </div>
        <div className=' p-2'>
        <h1>MONTHLY SALLES</h1>
        <span >$ 0</span>
        </div>
      </div>
     
    </div>
  )
}

export default Total_display