import React from 'react'
import SuccessStory from '../components/Success'
import TwoLineMarquee from '../components/Marquee'
import FundraisingComponent from '../components/Donation'
import CharityFAQ from '../components/Faq'
import VolunteerCards from '../components/Card'
import CrowdfundingTips from '../components/smallcards'
import GoFundMeScrollReveal from '../components/Text'
import CircularImageCarousel from '../components/Hero' 
import VideoWithSideImages from '../components/video'
const Homepage = () => {
  return (
    <div>
        <CircularImageCarousel />
        <CrowdfundingTips />
        <SuccessStory />
        <GoFundMeScrollReveal />
        <VolunteerCards />

      
      <TwoLineMarquee />
      <FundraisingComponent />
        
      <VideoWithSideImages />
      <CharityFAQ />
  
    </div>
  )
}

export default Homepage
