'use client'

import contactData from '@/Data/Contact'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MapPin, Clock, Linkedin, Instagram, Twitter, Facebook, MessageCircle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { sanitizePhone, formatAddress } from '@/lib/contactUtils'

// Icon mapping for social links
const iconMap = {
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
  MessageCircle
}

export default function Contact() {
  const {
    title,
    description,
    contactInfo,
    officeHours,
    socialLinks = [],
    googleMapsUrl
  } = contactData || {}

  const {
    email,
    phone,
    address
  } = contactInfo || {}

  const addressLines = formatAddress(address)

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
            <Separator className="w-24 mx-auto bg-primary/30 mt-3" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Information Card */}
          {(email || phone || addressLines || officeHours) && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Get in Touch</CardTitle>
                <CardDescription>
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email */}
                {email && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-primary">Email</h3>
                      <a
                        href={`mailto:${email}`}
                        className="text-foreground font-medium hover:underline"
                      >
                        {email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {phone && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-primary">Phone</h3>
                      <a
                        href={`tel:${sanitizePhone(phone)}`}
                        className="text-foreground font-medium hover:underline"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Address */}
                {addressLines && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-primary">Address</h3>
                      <p className="text-foreground font-medium">
                        {addressLines.map((line, index) => (
                          <span key={index}>
                            {line}
                            {index < addressLines.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                )}

                {/* Office Hours */}
                {officeHours && (
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="w-full">
                      <h3 className="font-semibold mb-1 text-primary">
                        Office Hours
                      </h3>

                      <div className="text-foreground font-medium">
                        {officeHours.mondayToFriday && (
                          <div className="flex flex-col sm:grid sm:grid-cols-[138px_1fr] sm:items-center">
                            <span className="text-primary">Monday - Friday</span>
                            <span>{officeHours.mondayToFriday}</span>
                          </div>
                        )}

                        {officeHours.saturday && (
                          <div className="flex flex-col sm:grid sm:grid-cols-[138px_1fr] sm:items-center">
                            <span className="text-primary">Saturday</span>
                            <span>{officeHours.saturday}</span>
                          </div>
                        )}

                        {officeHours.sunday && (
                          <div className="flex flex-col sm:grid sm:grid-cols-[138px_1fr] sm:items-center">
                            <span className="text-primary">Sunday</span>
                            <span>{officeHours.sunday}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>
          )}

          {/* Social Media Card */}
          {socialLinks?.length > 0 && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Follow Us</CardTitle>
                <CardDescription>
                  Connect with us on social media
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = iconMap[social.icon]
                    if (!IconComponent || !social.url) return null

                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-lg border-2 hover:bg-accent transition-colors"
                      >
                        <IconComponent className="h-6 w-6 text-primary" />
                        <span className="font-medium">{social.platform}</span>
                      </a>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Google Maps Embed */}
        {googleMapsUrl && addressLines && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Find Us</CardTitle>
              <CardDescription>
                {address?.line2 || 'Visit us at our location'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-100 rounded-lg overflow-hidden">
                <iframe
                  src={googleMapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}