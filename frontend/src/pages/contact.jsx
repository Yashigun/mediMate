import React, { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  return (
    <div id="contact" className='w-full bg-primary py-12 md:py-16 lg:py-20'>
      <div className=' max-w-7xl mx-auto px-6 md:px-10 lg:px-20'>
        <div className='flex flex-col md:flex-row items-center gap-8 md:gap-12'>

          {/* Left side */}
          <div className='flex-1 flex flex-col items-start justify-center gap-6 p-8 md:p-12 rounded-3xl transform hover:scale-[1.02] hover:shadow-3xl transition-all duration-500 ease-out animate-fade-in-up'>
            <h1 className='text-6xl md:text-4xl lg:text-5xl text-secondary font-bold leading-tight animate-slide-in-left'>
              Contact Us
            </h1>
            <p className='text-lg text-secondary/80 leading-relaxed'>
              We'd love to hear from you! Drop us a message and we'll get back to you as soon as possible.
            </p>
          </div>
          
          {/* Right side - Contact Form */}
          <div className='flex-1 w-full max-w-md'>
            <div className='bg-gradient-to-bl from-teal-900 via-primary to-primary backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 transform hover:scale-[1.02] transition-all duration-500'>
              {!isSubmitted ? (
                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <label className='text-secondary font-medium text-sm tracking-wide'>
                      Your Name
                    </label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-3 rounded-2xl bg-white/20 border border-white/30 text-secondary placeholder-secondary/60 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent transition-all duration-300'
                      placeholder='Enter your name'
                    />
                  </div>

                  <div className='space-y-2'>
                    <label className='text-secondary font-medium text-sm tracking-wide'>
                      Email Address
                    </label>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-3 rounded-2xl bg-white/20 border border-white/30 text-secondary placeholder-secondary/60 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent transition-all duration-300'
                      placeholder='your@email.com'
                    />
                  </div>

                  <div className='space-y-2'>
                    <label className='text-secondary font-medium text-sm tracking-wide'>
                      Message
                    </label>
                    <textarea
                      name='message'
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className='w-full px-4 py-3 rounded-2xl bg-white/20 border border-white/30 text-secondary placeholder-secondary/60 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent transition-all duration-300 resize-none'
                      placeholder='Tell us what you have in mind...'
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className='w-full bg-gradient-to-r from-secondary to-secondary/80 text-primary font-semibold py-4 px-6 rounded-2xl hover:from-secondary/90 hover:to-secondary transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300 active:scale-[0.98]'
                  >
                    Send Message
                  </button>
                </div>
              ) : (
                <div className='text-center py-8 space-y-4 animate-pulse'>
                  <div className='text-6xl'></div>
                  <h3 className='text-2xl font-bold text-secondary'>
                    Thank You!
                  </h3>
                  <p className='text-secondary/80'>
                    Your message has been sent successfully. We'll get back to you soon!
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Contact;