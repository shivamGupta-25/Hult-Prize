'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Mail } from 'lucide-react';

const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const CoreTeamDisplay = ({ coreTeam, title = "Core Council" }) => {
  if (!coreTeam || coreTeam.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="flex items-center justify-center space-x-3 sm:space-x-4">
        <div className="h-px bg-primary w-12 sm:w-16 md:w-32"></div>
        <h2 className="text-2xl sm:text-3xl font-bold text-center whitespace-nowrap">
          {title}
        </h2>
        <div className="h-px bg-primary w-12 sm:w-16 md:w-32"></div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {coreTeam.map((member, idx) => (
          <Card
            key={idx}
            className="border border-border/50 bg-card shadow-sm hover:shadow-xl transition-all duration-500 hover:border-primary/30 overflow-hidden"
          >
            <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center space-y-3 sm:space-y-4">
              {/* Avatar */}
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 border-2 border-primary/20 hover:border-primary transition-all duration-500 shadow-lg bg-primary/10">
                <AvatarImage
                  src={member.image}
                  alt={member.name}
                  className="object-cover object-top"
                />
                <AvatarFallback className="bg-transparent text-xl sm:text-2xl font-bold text-primary">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>

              {/* Name and Role */}
              <div className="space-y-1 sm:space-y-2 w-full">
                <h4 className="font-bold text-sm sm:text-base md:text-lg text-foreground hover:text-primary transition-colors duration-300">
                  {member.name}
                </h4>
                {member.role && (
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium px-2 sm:px-3 py-1 rounded-full bg-primary/5 border border-primary/10 inline-block dark:text-foreground">
                    {member.role}
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div className="flex gap-2 sm:gap-3 justify-center">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 sm:p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:ring-1 hover:shadow-[0_0_14px_6px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_0_18px_8px_rgba(255,255,255,0.28)]"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {member.mail && (
                  <a
                    href={`mailto:${member.mail}`}
                    className="p-1.5 sm:p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:ring-1 hover:shadow-[0_0_14px_6px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_0_18px_8px_rgba(255,255,255,0.28)]"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CoreTeamDisplay;