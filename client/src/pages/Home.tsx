import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import FloatingAnimation from "@/components/FloatingAnimation";
import ProjectCard from "@/components/ProjectCard";
import TestimonialCard from "@/components/TestimonialCard";
import CounterItem from "@/components/CounterItem";
import ContactCard from "@/components/ContactCard";
import { projects, testimonials, contactInfo } from "@/lib/data";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen">
      <Navbar onOpenLoginModal={() => setIsLoginModalOpen(true)} />
      
      {/* Hero Section */}
      <section id="home" className="pt-24 md:pt-32 pb-16 md:pb-24 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 -z-10"></div>
        
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-72 h-72 bg-accent/10 rounded-full filter blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 mb-12 md:mb-0"
            >
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                Discover Your <span className="text-primary">Potential</span> Through <span className="text-accent">Capstone</span> Projects
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl">
                Elevate your learning experience with real-world projects that showcase your skills and creativity at Elsewedy School.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <i className="ri-rocket-line mr-2"></i> Explore Projects
                </Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  <i className="ri-information-line mr-2"></i> Learn More
                </Button>
              </div>
              
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Student" />
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Student" />
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Student" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-white text-xs font-bold">+25</div>
                </div>
                <p className="text-gray-600 text-sm">Join <span className="font-bold text-dark">250+ students</span> already working on capstone projects</p>
              </div>
            </motion.div>
            
            <FloatingAnimation delay={0.5} className="md:w-1/2 relative">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" className="rounded-2xl shadow-xl max-w-full" alt="Students collaborating on a project" />
                
                {/* Floating Elements */}
                <FloatingAnimation delay={1} className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <i className="ri-award-line text-primary text-xl"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Projects Completed</p>
                      <p className="font-bold text-dark">124+</p>
                    </div>
                  </div>
                </FloatingAnimation>
                
                <FloatingAnimation delay={2} className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <i className="ri-team-line text-accent text-xl"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Active Teams</p>
                      <p className="font-bold text-dark">32</p>
                    </div>
                  </div>
                </FloatingAnimation>
              </div>
            </FloatingAnimation>
          </div>
          
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 scroll-indicator"
          >
            <i className="ri-arrow-down-line text-2xl text-primary"></i>
          </motion.div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-gray-50 to-transparent"></div>
        
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">What are <span className="text-primary">Capstone</span> Projects?</h2>
            <p className="text-gray-700 text-lg">Capstone projects are comprehensive assignments that challenge students to apply everything they've learned throughout their educational journey at Elsewedy School.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "ri-lightbulb-flash-line",
                color: "primary",
                title: "Real-World Learning",
                description: "Tackle authentic challenges that prepare you for your future career through hands-on project experience."
              },
              {
                icon: "ri-team-line",
                color: "secondary",
                title: "Team Collaboration",
                description: "Work with peers in structured teams with defined roles to develop crucial teamwork and leadership skills."
              },
              {
                icon: "ri-presentation-line",
                color: "accent",
                title: "Portfolio Building",
                description: "Create impressive projects that demonstrate your capabilities to future employers and higher education institutions."
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-xl shadow-lg p-8 card-hover"
              >
                <div className={`w-14 h-14 rounded-full bg-${card.color}/20 flex items-center justify-center mb-6`}>
                  <i className={`${card.icon} text-2xl text-${card.color}`}></i>
                </div>
                <h3 className="font-heading font-semibold text-xl mb-4">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mt-20 bg-gradient-to-r from-primary to-accent rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 md:p-12 flex items-center">
                <div className="text-white">
                  <h3 className="font-heading font-bold text-2xl md:text-3xl mb-4">Program Structure</h3>
                  <p className="mb-6 opacity-90">Our capstone program is designed with a clear structure to guide students through the entire project lifecycle.</p>
                  
                  <div className="space-y-4">
                    {[
                      {
                        num: "1",
                        title: "Project Proposal",
                        desc: "Teams submit project ideas for approval by faculty advisors."
                      },
                      {
                        num: "2",
                        title: "Development Phase",
                        desc: "Students work on projects with regular check-ins and milestone reviews."
                      },
                      {
                        num: "3",
                        title: "Final Presentation",
                        desc: "Teams showcase their completed projects to faculty, peers, and industry partners."
                      }
                    ].map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-8 h-8 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center mt-1">
                          <i className={`ri-number-${step.num} text-white`}></i>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{step.title}</h4>
                          <p className="opacity-90 text-sm">{step.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 relative">
                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" className="h-full w-full object-cover" alt="Students presenting their project" />
                <div className="absolute inset-0 bg-gradient-to-r from-accent/60 to-transparent"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Projects Showcase */}
      <section id="projects" className="py-16 md:py-24 bg-gray-50 relative">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">Featured <span className="text-primary">Capstone</span> Projects</h2>
            <p className="text-gray-700 text-lg">Explore some of the outstanding projects created by our students that showcase their creativity, technical skills, and problem-solving abilities.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center"
          >
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              View All Projects <i className="ri-arrow-right-line ml-2"></i>
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="py-16 md:py-20 bg-white relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-10 md:p-16"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <CounterItem end={24} suffix="+" label="Teams Working" color="text-primary" />
              <CounterItem end={120} suffix="+" label="Students Involved" color="text-accent" />
              <CounterItem end={36} label="Faculty Mentors" color="text-secondary" />
              <CounterItem end={18} label="Industry Partners" color="text-primary" />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">What Our <span className="text-primary">Students</span> Say</h2>
            <p className="text-gray-700 text-lg">Hear from students who have completed their capstone projects and how the experience impacted their education and career prospects.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-primary to-accent rounded-3xl overflow-hidden shadow-xl"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-10 md:p-16 flex items-center">
                <div className="text-white max-w-lg">
                  <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">Ready to Start Your Capstone Journey?</h2>
                  <p className="mb-8 opacity-90 text-lg">Sign in to access your project dashboard, connect with team members, and begin working on your capstone project.</p>
                  
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-opacity-90"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    <i className="ri-login-box-line mr-2"></i> Sign In Now
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2 relative hidden md:block">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" className="h-full w-full object-cover" alt="Students collaborating" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-accent/60"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">Get in <span className="text-primary">Touch</span></h2>
            <p className="text-gray-700 text-lg">Have questions about the capstone program? Reach out to our team for more information.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactInfo.map((item, index) => (
              <ContactCard key={index} {...item} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
      
      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
