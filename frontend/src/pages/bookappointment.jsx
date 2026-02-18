import React, { useState, useEffect} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
//import { useAuth } from "../context/AuthContext"; // Import the auth context

const Bookappointment = () => {
  //const { token } = useAuth(); // Get token from auth context
  const token = localStorage.getItem("token");
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const navigate = useNavigate();
  
  const daysOfWeek = ['SUN','MON','TUE','WED','THURS','FRI','SAT']

  const getAvailableSlots = async ()=>{
    setDocSlots([])

    //get current date
    let today = new Date()
    
    for(let i = 0; i < 7; i++){
      //getting date with index 
      let currDate = new Date(today)
      currDate.setDate(today.getDate() + i)

      //setting end time of date with index 
      let endTime = new Date(currDate)
      endTime.setHours(22,0,0,0)

      //setting hours
      if(i === 0){
        currDate.setHours(currDate.getHours() > 10 ? currDate.getHours() + 1 : 10)
        currDate.setMinutes(currDate.getMinutes() > 30 ? 30 : 0)
      } else{
        currDate.setHours(10)
        currDate.setMinutes(0)
      }

      let timeSlots = []
      while(currDate < endTime) {
        let formattedTime = currDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        //add slot to array
        timeSlots.push({
          datetime: new Date(currDate),
          time: formattedTime
        })

        //increment current time by 30 mins
        currDate.setMinutes(currDate.getMinutes() + 30)
      }

      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  useEffect(()=>{
    getAvailableSlots()
  },[])

  useEffect(()=>{
    console.log(docSlots)
  },[docSlots])
  
  return (
    <div id = "bookappt" className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col py-20'>
    <header className="bg-gradient-to-r from-primary to-teal-700 shadow-lg border-b border-primary flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Book Appointment
              </h1>
              <p className="mt-2 text-blue-100 text-sm sm:text-base font-medium">
                Schedule your consultation with ease
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
            </div>
          </div>
        </div>
      </div>
    </header>

      {/* Main Content */}
      <div className='flex-1 py-6'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-5'>
            
            {/* Date Selection Section */}
            <div className='p-6 border-b border-gray-100'>
              
              {/* title */}
              <div className='mb-4'>
                <h2 className='text-lg font-semibold text-gray-800 mb-2'>Choose your Date</h2>
                <div className='w-16 h-1 bg-gradient-to-r from-primary to-teal-700 rounded-full'></div>
              </div>
              
              <div className='flex gap-3 overflow-x-visible pb-2'>
                {docSlots.length && docSlots.map((item, index) => (
                  <div 
                    onClick={() => setSlotIndex(index)} 
                    className={`
                      group relative flex-shrink-0 text-center py-4 px-4 min-w-[80px] rounded-xl cursor-pointer 
                      transition-all duration-200 ease-in-out hover:scale-105
                      ${slotIndex === index 
                        ? 'bg-primary text-white shadow-lg shadow-blue-600/25 ring-2 ring-blue-500/20' 
                        : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md'
                      }
                    `} 
                    key={index}
                  >
                    {/* Selection indicator */}
                    {slotIndex === index && (
                      <div className='absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm'>
                        <div className='w-2 h-2 bg-primary rounded-full'></div>
                      </div>
                    )}
                    
                    {/* Day of week */}
                    <p className={`text-xs font-medium mb-1 uppercase tracking-wide ${slotIndex === index ? 'text-blue-100' : 'text-gray-500'}`}>
                      {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                    </p>
                    
                    {/* Date */}
                    <p className={`text-lg font-bold ${slotIndex === index ? 'text-white' : 'text-gray-800'}`}>
                      {item[0] && item[0].datetime.getDate()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Selection Section */}
            <div className='p-6'>
              <div className='mb-4'>
                <h2 className='text-lg font-semibold text-gray-800 mb-2'>Choose your Time</h2>
                <div className='w-16 h-1 bg-gradient-to-r from-primary to-green-900 rounded-full'></div>
              </div>
              
              {docSlots.length > 0 && docSlots[slotIndex] && (
                <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 mb-6'>
                  {docSlots[slotIndex].map((slot, timeIdx) => (
                    <button
                      key={timeIdx}
                      onClick={() => setSlotTime(slot.time)}
                      className={`
                        py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out hover:scale-105
                        ${slotTime === slot.time 
                          ? 'bg-primary text-white shadow-lg shadow-green-600/25 ring-2 ring-green-500/20' 
                          : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-green-900 hover:bg-green-50 hover:shadow-md hover:scale-105'
                        }
                      `}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Appointment Summary */}
              {docSlots.length > 0 && slotIndex !== null && slotTime && (
                <div className='bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-4'>
                  <div className='flex items-center justify-between flex-wrap gap-4'>
                    <div>
                      <h3 className='text-base font-semibold text-gray-800 mb-1'>Appointment Summary</h3>
                      <p className='text-sm text-gray-600'>
                        <span className='font-medium text-primary'>
                          {docSlots[slotIndex]?.[0] && daysOfWeek[docSlots[slotIndex][0].datetime.getDay()]}
                        </span>
                        <span className='mx-2'>•</span>
                        <span className='font-medium text-primary'>
                          {docSlots[slotIndex]?.[0] && docSlots[slotIndex][0].datetime.toLocaleDateString()}
                        </span>
                        <span className='mx-2'>•</span>
                        <span className='font-medium text-primary'>{slotTime}</span>
                      </p>
                    </div>
                    
                    {/* Fixed conditional logic */}
                    <button 
                      onClick={() => token ? navigate('/doctors') : navigate('/redirecting')} 
                      className='bg-primary text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 hover:scale-105 shadow-lg text-sm'
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bookappointment