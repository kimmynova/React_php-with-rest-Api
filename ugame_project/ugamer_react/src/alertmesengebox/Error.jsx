import React, { useContext } from 'react'
import { AlertContext } from './alert';

const Error = () => {
  const Alertbox = useContext(AlertContext);
  return (
    <div class="grid h-[80%] px-4 bg-[] place-content-center">
  <div class="text-center">
    <h1 class="font-black text-gray-400 text-9xl">403</h1>

    <p class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
    ACCESS NOT GRANTED!
    </p>

    <p class="mt-4 text-gray-500">you're not allowed to access.</p>

    {/* <a
      href="#"
      class="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring"
    >
      Go Back Home
    </a> */}
  </div>
</div>
       
        
  )
}

export default Error