import Hero from './landing/sections/Hero';
import TrustedBy from './landing/sections/TrustedBy';
import LiveDemo from './landing/sections/LiveDemo';
import HowItWorks from './landing/sections/HowItWorks';
import Stats from './landing/sections/Stats';
import Features from './landing/sections/Features';
import Pricing from './landing/sections/Pricing';
import Testimonials from './landing/sections/Testimonials';
import Faq from './landing/sections/Faq';
import FinalCta from './landing/sections/FinalCta';

export default function Landing() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <LiveDemo />
      <HowItWorks />
      <Stats />
      <Features />
      <Pricing />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
