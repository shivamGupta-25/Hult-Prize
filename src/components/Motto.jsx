import React from 'react'
import { mottoData } from "@/Data/SiteData";
import { Card, CardContent } from '@/components/ui/card'

export const Motto = () => {
  const { text, attribution } = mottoData

  // Extract first sentence for display
  const firstSentence = text.split('.')[0]

  return (
    <section className="w-full py-12 px-4 md:py-16 sm:px-6 lg:py-20 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Card className="border-2 border-primary/20 bg-card/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardContent className="p-8 md:p-12 lg:p-16">
            <div className="flex flex-col items-center space-y-6 text-center">
              {/* Motto Text */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold leading-tight italic sm:text-3xl md:text-4xl lg:text-5xl">
                  <span className="text-foreground">&ldquo;{firstSentence}</span>
                  <span className="text-primary">.</span>&rdquo;
                </h2>

                {/* Attribution */}
                {attribution && (
                  <p className="text-lg font-medium text-muted-foreground sm:text-xl md:text-2xl">
                    {attribution}
                  </p>
                )}
              </div>

              {/* Decorative Separator */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-0.5 w-12 bg-primary/30 rounded-full" />
                <div className="h-0.5 w-16 bg-primary/50 rounded-full" />
                <div className="h-0.5 w-12 bg-primary/30 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}