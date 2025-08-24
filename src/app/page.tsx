import HeaderNav from "@/components/HeaderNav"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import EducationSection from "@/components/EducationSection"
import ProjectsSection from "@/components/ProjectsSection"
import ExperienceSection from "@/components/ExperienceSection"
import SkillsSection from "@/components/SkillsSection"
import CertificationsSection from "@/components/CertificationsSection"
import OptionalSectionsRenderer from "@/components/OptionalSectionsRenderer"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"

export default function HomePage() {
  const contactInfo = {
    email: "hello@rishesh.dev",
    phone: "+1 (555) 123-4567",
    address: "San Francisco, CA",
    showPhone: true,
    showAddress: true,
    showMap: true
  }

  const socialLinks = [
    { platform: "github" as const, url: "https://github.com", followers: 1200 },
    { platform: "linkedin" as const, url: "https://linkedin.com", followers: 800 },
    { platform: "twitter" as const, url: "https://twitter.com", followers: 500 }
  ]

  const categories = ["General Inquiry", "Project Collaboration", "Consulting", "Speaking Engagement"]

  return (
    <main className="min-h-screen bg-background">
      <HeaderNav />
      
      <div className="relative">
        <section id="home" className="min-h-screen">
          <HeroSection />
        </section>

        <div className="container max-w-7xl mx-auto px-4 space-y-20 py-20">
          <section id="about">
            <AboutSection />
          </section>

          <section id="education">
            <EducationSection />
          </section>

          <section id="projects">
            <ProjectsSection />
          </section>

          <section id="leadership">
            <ExperienceSection />
          </section>

          <section id="skills">
            <SkillsSection />
          </section>

          <section id="certifications">
            <CertificationsSection />
          </section>

          <section id="optional-content">
            <OptionalSectionsRenderer />
          </section>
        </div>

        <section id="contact">
          <ContactSection
            contactInfo={contactInfo}
            socialLinks={socialLinks}
            categories={categories}
            enableRecaptcha={false}
            mapEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387191.33750346623!2d-122.41941550920544!3d37.77492981118811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1635959831742!5m2!1sen!2sus"
          />
        </section>

        <Footer />
      </div>
    </main>
  )
}