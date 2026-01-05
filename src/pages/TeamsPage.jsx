import TeamData from '@/Data/TeamData';
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CoreTeamDisplay } from '@/components/CoreTeamDisplay';

export const Teams = () => {
  const years = Object.keys(TeamData).sort((a, b) => b.localeCompare(a));
  const [activeYear, setActiveYear] = useState(years[0]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDepartmentName = (deptName) => {
    return deptName.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">

        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            Meet Our Team
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            The passionate individuals driving innovation and change at Hult Prize.
          </p>
          <Separator className="w-20 sm:w-24 md:w-32 mx-auto bg-primary/40 h-1" />
        </div>

        {/* Year Selector */}
        <Tabs
          defaultValue={activeYear}
          onValueChange={setActiveYear}
          className="w-full flex flex-col items-center"
        >
          <TabsList className="mb-6 sm:mb-8 p-1 bg-muted/50 backdrop-blur-sm rounded-full flex-wrap h-auto gap-1">
            {years.map((year) => (
              <TabsTrigger
                key={year}
                value={year}
                className="rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {year}
              </TabsTrigger>
            ))}
          </TabsList>

          {years.map((year) => {
            const data = TeamData[year];
            if (!data) return null;

            return (
              <TabsContent
                key={year}
                value={year}
                className="w-full space-y-12 sm:space-y-16 animate-in zoom-in-95 duration-500"
              >

                {/* Core Council Section */}
                <CoreTeamDisplay coreTeam={data.council.coreTeam} />

                {/* Departments Section */}
                {data.council.departments && (
                  <section className="space-y-8 sm:space-y-12">
                    <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                      <div className="h-px bg-primary w-12 sm:w-16 md:w-32"></div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-center">
                        Departments
                      </h2>
                      <div className="h-px bg-primary w-12 sm:w-16 md:w-32"></div>
                    </div>

                    <div className="space-y-8 sm:space-y-12">
                      {Object.entries(data.council.departments).map(([deptName, deptData]) => (
                        <div key={deptName} className="space-y-4 sm:space-y-6">
                          <h3 className="text-xl sm:text-2xl font-semibold border-l-4 border-primary pl-3 sm:pl-4">
                            {formatDepartmentName(deptName)}
                          </h3>

                          {/* Heads and Senior Members */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                            {deptData.heads?.map((head, hIdx) => (
                              <div
                                key={hIdx}
                                className="flex items-center space-x-3 bg-muted/30 p-3 sm:p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors"
                              >
                                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-primary shrink-0">
                                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                                    {getInitials(head.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="font-semibold text-sm sm:text-base truncate">
                                    {head.name}
                                  </p>
                                  <Badge variant="secondary" className="text-xs">
                                    Head
                                  </Badge>
                                </div>
                              </div>
                            ))}
                            {deptData.seniorMembers?.map((member, sIdx) => (
                              <div
                                key={`snr-${sIdx}`}
                                className="flex items-center space-x-3 bg-muted/30 p-3 sm:p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors"
                              >
                                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0">
                                  <AvatarFallback className="bg-muted text-muted-foreground font-medium text-sm">
                                    {getInitials(member.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="font-medium text-sm truncate">
                                    {member.name}
                                  </p>
                                  <span className="text-xs text-muted-foreground">
                                    Senior Member
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Members */}
                          {deptData.members && deptData.members.length > 0 && (
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                              {deptData.members.map((member, mIdx) => (
                                <Badge
                                  key={mIdx}
                                  variant="outline"
                                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-normal"
                                >
                                  {member.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Advisory Board */}
                {data.council.advisory && data.council.advisory.length > 0 && (
                  <section className="space-y-6 sm:space-y-8 pt-8 sm:pt-12 border-t border-border">
                    <h2 className="text-xl sm:text-2xl font-bold text-center text-primary">
                      Advisory Board
                    </h2>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
                      {data.council.advisory.map((advisor, idx) => (
                        <div
                          key={idx}
                          className="bg-card px-4 sm:px-6 py-2 sm:py-3 rounded-full border shadow-sm text-center font-medium text-sm sm:text-base"
                        >
                          {advisor.name}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};