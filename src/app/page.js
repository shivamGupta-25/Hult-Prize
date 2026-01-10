import Banner from "@/components/Banner";
import { Motto } from "@/components/Motto";
import About from "@/components/About";
import { FeaturedBlogs } from "@/components/FeaturedBlogs";
import { CoreTeamDisplay } from '@/components/CoreTeamDisplay'
import TeamData from "@/Data/TeamData";

export default function Home() {
  const years = Object.keys(TeamData).sort((a, b) => b.localeCompare(a));
  const latestYear = years[0];
  const coreTeam = TeamData[latestYear]?.council?.coreTeam || [];
  return (
    <>
      <Banner />
      <Motto />
      <About />
      <FeaturedBlogs />
      {coreTeam.length > 0 && (
        <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <CoreTeamDisplay coreTeam={coreTeam} title={<p><span className="text-white">Current Session</span> <span className="text-primary">Core Council</span></p>} />
          </div>
        </section>
      )}
    </>
  );
}