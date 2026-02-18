import React, { useState } from 'react'
import { Calendar, Clock, MapPin, Star, User, Phone, Mail, Stethoscope, Check, X } from 'lucide-react'

const Doctors = () => {
  const [doctors] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Smith',
      specialty: 'Cardiology',
      hospital: 'Apollo Hospital, Delhi',
      experience: '15 years',
      rating: 4.8,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23e5e7eb'/%3E%3Ccircle cx='60' cy='45' r='20' fill='%239ca3af'/%3E%3Cpath d='M25 100c0-20 15-35 35-35s35 15 35 35' fill='%239ca3af'/%3E%3C/svg%3E",
      availableSlots: ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'],
      phone: '+91 98765-43210',
      email: 'dr.smith@apollo.com',
      consultationFee: '₹800'
    },
    {
      id: 2,
      name: 'Dr. Michael Johnson',
      specialty: 'Dermatology',
      hospital: 'Max Healthcare, Saket',
      experience: '12 years',
      rating: 4.7,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23e5e7eb'/%3E%3Ccircle cx='60' cy='45' r='20' fill='%239ca3af'/%3E%3Cpath d='M25 100c0-20 15-35 35-35s35 15 35 35' fill='%239ca3af'/%3E%3C/svg%3E",
      availableSlots: ['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM'],
      phone: '+91 98765-43211',
      email: 'dr.johnson@max.com',
      consultationFee: '₹600'
    },
    {
      id: 3,
      name: 'Dr. Emily Williams',
      specialty: 'General Medicine',
      hospital: 'AIIMS, New Delhi',
      experience: '10 years',
      rating: 4.9,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23e5e7eb'/%3E%3Ccircle cx='60' cy='45' r='20' fill='%239ca3af'/%3E%3Cpath d='M25 100c0-20 15-35 35-35s35 15 35 35' fill='%239ca3af'/%3E%3C/svg%3E",
      availableSlots: ['8:00 AM', '11:00 AM', '2:30 PM', '5:00 PM'],
      phone: '+91 98765-43212',
      email: 'dr.williams@aiims.com',
      consultationFee: '₹500'
    },
    {
      id: 4,
      name: 'Dr. Robert Brown',
      specialty: 'Orthopedics',
      hospital: 'Fortis Hospital, Gurgaon',
      experience: '18 years',
      rating: 4.6,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23e5e7eb'/%3E%3Ccircle cx='60' cy='45' r='20' fill='%239ca3af'/%3E%3Cpath d='M25 100c0-20 15-35 35-35s35 15 35 35' fill='%239ca3af'/%3E%3C/svg%3E",
      availableSlots: ['9:30 AM', '12:00 PM', '3:00 PM', '4:45 PM'],
      phone: '+91 98765-43213',
      email: 'dr.brown@fortis.com',
      consultationFee: '₹900'
    },
    {
      id: 5,
      name: 'Dr. Lisa Davis',
      specialty: 'Pediatrics',
      hospital: 'BLK Super Speciality Hospital',
      experience: '14 years',
      rating: 4.8,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23e5e7eb'/%3E%3Ccircle cx='60' cy='45' r='20' fill='%239ca3af'/%3E%3Cpath d='M25 100c0-20 15-35 35-35s35 15 35 35' fill='%239ca3af'/%3E%3C/svg%3E",
      availableSlots: ['10:00 AM', '1:30 PM', '3:30 PM', '5:30 PM'],
      phone: '+91 98765-43214',
      email: 'dr.davis@blk.com',
      consultationFee: '₹700'
    },
    {
      id: 6,
      name: 'Dr. James Wilson',
      specialty: 'Neurology',
      hospital: 'Medanta - The Medicity',
      experience: '20 years',
      rating: 4.9,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23e5e7eb'/%3E%3Ccircle cx='60' cy='45' r='20' fill='%239ca3af'/%3E%3Cpath d='M25 100c0-20 15-35 35-35s35 15 35 35' fill='%239ca3af'/%3E%3C/svg%3E",
      availableSlots: ['8:30 AM', '11:30 AM', '2:00 PM', '4:00 PM'],
      phone: '+91 98765-43215',
      email: 'dr.wilson@medanta.com',
      consultationFee: '₹1200'
    }
  ])

  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [appointments, setAppointments] = useState([])

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor)
    setSelectedSlot('')
    setSelectedDate('')
  }

  const handleConfirmAppointment = () => {
    if (selectedDoctor && selectedSlot && selectedDate) {
      const newAppointment = {
        id: Date.now(),
        doctor: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: selectedDate,
        time: selectedSlot,
        hospital: selectedDoctor.hospital,
        status: 'Scheduled'
      }
      
      setAppointments(prev => [...prev, newAppointment])
      setShowConfirmation(true)
      
      // Reset form
      setTimeout(() => {
        setSelectedDoctor(null)
        setSelectedSlot('')
        setSelectedDate('')
        setShowConfirmation(false)
      }, 2000)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  // Get tomorrow's date as minimum selectable date
  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-teal-700 py-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Available Doctors</h1>
          <p className="text-gray-100">Find and book appointments with our experienced doctors</p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-2xl shadow-lg border-2 border-teal-200 p-6 hover:shadow-xl transition-all duration-300">
              {/* Doctor Info */}
              <div className="flex items-center mb-4">
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full border-2 border-teal-200 mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{doctor.name}</h3>
                  <p className="text-teal-600 font-semibold">{doctor.specialty}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex mr-2">
                      {renderStars(doctor.rating)}
                    </div>
                    <span className="text-sm text-gray-600">({doctor.rating})</span>
                  </div>
                </div>
              </div>

              {/* Hospital */}
              <div className="flex items-center mb-3 p-3 bg-teal-50 rounded-lg">
                <MapPin className="w-4 h-4 text-teal-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">{doctor.hospital}</span>
              </div>

              {/* Experience & Fee */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Experience</p>
                  <p className="font-semibold text-gray-800">{doctor.experience}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Consultation</p>
                  <p className="font-semibold text-teal-600">{doctor.consultationFee}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-3 h-3 mr-2" />
                  {doctor.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-3 h-3 mr-2" />
                  {doctor.email}
                </div>
              </div>

              {/* Book Appointment Button */}
              <button
                onClick={() => handleBookAppointment(doctor)}
                className="w-full bg-teal-700 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors duration-200 font-semibold"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>

        {/* Appointment Booking Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Book Appointment</h2>
                  <button
                    onClick={() => setSelectedDoctor(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Doctor Info */}
                <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <div className="flex items-center mb-2">
                    <img 
                      src={selectedDoctor.image} 
                      alt={selectedDoctor.name}
                      className="w-12 h-12 rounded-full border-2 border-teal-200 mr-3"
                    />
                    <div>
                      <h3 className="font-bold text-gray-800">{selectedDoctor.name}</h3>
                      <p className="text-sm text-teal-600">{selectedDoctor.specialty}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedDoctor.hospital}
                  </p>
                </div>

                {/* Date Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Select Date</label>
                  <input
                    type="date"
                    min={getTomorrowDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                  />
                </div>

                {/* Time Slot Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Available Time Slots</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDoctor.availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                          selectedSlot === slot
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confirmation Fee */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Consultation Fee:</span>
                    <span className="font-bold text-teal-600">{selectedDoctor.consultationFee}</span>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleConfirmAppointment}
                  disabled={!selectedSlot || !selectedDate}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    selectedSlot && selectedDate
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirm Appointment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Confirmation Popup */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Appointment Scheduled!</h3>
                <p className="text-gray-600 mb-4">
                  Your appointment with {selectedDoctor?.name} has been successfully booked for {selectedDate} at {selectedSlot}.
                </p>
                <p className="text-sm text-teal-600 font-semibold">
                  Check "My Appointments" section for details.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* My Appointments Section (for demonstration) */}
        {appointments.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg border-2 border-teal-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-6 h-6 text-teal-600 mr-2" />
              My Appointments
            </h2>
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex justify-between items-center p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <div>
                    <p className="font-semibold text-gray-800">{appointment.doctor}</p>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    <p className="text-xs text-gray-500">{appointment.hospital}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{appointment.date}</p>
                    <p className="text-sm text-gray-600">{appointment.time}</p>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Doctors