import React from 'react'

import ContactusBanner from '../components/ContactusBanner'
import ContactForm from '../components/ContactForm'
import ContactCards from '../components/ContactCard'
function ContactPage  ()  {
  return (
    <div>
        <ContactusBanner />
       
        <ContactCards />
      
        <ContactForm />
 
    </div>
  )
}

export default ContactPage
