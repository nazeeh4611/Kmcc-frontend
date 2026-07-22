import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import AboutMission from "../components/AboutMission";
import ImpactStats from "../components/ImpactStats";
import Committee from "../components/Committee";
import SecretariatMedia from "../components/SecretariatMedia";
import PanchayathCta from "../components/PanchayathCta";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper">
      <Navbar />
      <Hero />
      <Features />
      <AboutMission />
      <ImpactStats />
      <Committee />
      <SecretariatMedia />
      <PanchayathCta />
      <Footer />
    </main>
  );
}
