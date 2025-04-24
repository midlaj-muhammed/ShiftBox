
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow">
        {/* Hero section */}
        <section className="py-16 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-background z-0"></div>
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-primary/5 to-transparent z-0"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-6 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Introducing ShiftBox
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-poppins bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Move Files with Confidence
                </h1>
                <p className="text-xl md:text-2xl text-foreground/80 font-space leading-relaxed">
                  Securely share files between teams, clients, and partners with
                  <span className="text-primary font-medium"> military-grade encryption</span> and a
                  <span className="text-primary font-medium"> beautiful interface</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="rounded-full font-medium text-base px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300">
                    <Link to="/signup">Start for free</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full text-base px-8 py-6 border-primary text-primary hover:bg-primary/5">
                    <Link to="#how-it-works">See how it works</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-4 pt-4 text-sm text-muted-foreground">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium text-primary">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span>Trusted by 10,000+ users worldwide</span>
                </div>
              </div>
              <div className="lg:ml-auto">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-xl">
                  </div>
                  <div className="relative bg-background/80 backdrop-blur-sm border border-primary/10 p-6 rounded-2xl shadow-xl">
                    <div className="aspect-video rounded-xl bg-secondary/50 flex items-center justify-center overflow-hidden">
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="12" y1="18" x2="12" y2="12"></line>
                          <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                        <div className="text-lg font-medium font-space">Drag files here to upload</div>
                        <p className="text-sm text-muted-foreground mt-2">or click to browse</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="text-sm font-medium mb-2 font-space">Recently shared</div>
                      <div className="space-y-2">
                        {["Project_Presentation.pdf", "Team_Budget_2024.xlsx", "Product_Design.fig"].map((file) => (
                          <div key={file} className="flex items-center justify-between p-2 bg-secondary/50 rounded-md hover:bg-secondary transition-colors">
                            <div className="flex items-center">
                              <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                  <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                              </div>
                              <span className="text-sm font-medium">{file}</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="19" cy="12" r="1"></circle>
                                <circle cx="5" cy="12" r="1"></circle>
                              </svg>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section id="features" className="py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Features
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-poppins">Powerful features, beautiful interface</h2>
              <p className="text-muted-foreground text-lg font-space">Everything you need to manage, share, and secure your files with elegance and simplicity.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-primary/10 hover-lift transition-all duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 font-space">Lightning-fast uploads</h3>
                <p className="text-foreground/80">Upload files of any size with our optimized transfer protocol that works even on slower connections.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-primary/10 hover-lift transition-all duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 font-space">Bank-level security</h3>
                <p className="text-foreground/80">End-to-end encryption ensures your sensitive data remains protected at all times.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-primary/10 hover-lift transition-all duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 font-space">Smart notifications</h3>
                <p className="text-foreground/80">Get notified when someone views or downloads your shared files with detailed access logs.</p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link to="/signup">
                <Button className="rounded-full px-8 py-6 text-base font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300">
                  Get started with all features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-background to-background z-0"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
                How It Works
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-poppins">Three simple steps</h2>
              <p className="text-foreground/80 text-lg font-space">A streamlined process designed for speed, security, and simplicity.</p>
            </div>

            <div className="grid gap-12 md:grid-cols-3 max-w-4xl mx-auto relative">
              {/* Connecting line */}
              <div className="absolute top-10 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 hidden md:block"></div>

              <div className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl mb-6 shadow-lg shadow-primary/20 z-10">1</div>
                <h3 className="text-xl font-bold mb-3 font-space">Sign Up</h3>
                <p className="text-foreground/80">Create a free account in seconds with just your email address.</p>
              </div>

              <div className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl mb-6 shadow-lg shadow-primary/20 z-10">2</div>
                <h3 className="text-xl font-bold mb-3 font-space">Upload</h3>
                <p className="text-foreground/80">Drag and drop your files securely to our encrypted cloud storage.</p>
              </div>

              <div className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl mb-6 shadow-lg shadow-primary/20 z-10">3</div>
                <h3 className="text-xl font-bold mb-3 font-space">Share</h3>
                <p className="text-foreground/80">Generate secure links to share with anyone, anywhere in the world.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing section */}
        <section id="pricing" className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
              <p className="text-muted-foreground text-lg">No hidden fees. Choose the plan that's right for you.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="bg-background rounded-lg p-6 shadow-sm border border-border hover-lift">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Free</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground mt-2">Perfect for personal use</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {['5GB storage', '2GB file size limit', 'Basic security', '24-hour link expiry'].map((feature) => (
                    <li key={feature} className="flex">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="w-full">Get Started</Button>
              </div>

              {/* Pro Plan */}
              <div className="bg-background rounded-lg p-6 shadow-md border border-primary relative hover-lift">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Pro</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$9</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground mt-2">For professionals and small teams</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {['100GB storage', '10GB file size limit', 'Advanced security', 'Custom link expiry', 'Password protection', 'Email notifications'].map((feature) => (
                    <li key={feature} className="flex">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full">Choose Pro</Button>
              </div>

              {/* Business Plan */}
              <div className="bg-background rounded-lg p-6 shadow-sm border border-border hover-lift">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Business</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground mt-2">For larger teams and businesses</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {['1TB storage', 'Unlimited file size', 'Enterprise-grade security', 'Custom branding', 'Advanced analytics', 'Priority support', 'Multiple admin accounts'].map((feature) => (
                    <li key={feature} className="flex">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="w-full">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Trusted by thousands</h2>
              <p className="text-muted-foreground text-lg">See what our users have to say about ShiftBox.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Testimonial 1 */}
              <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="font-medium text-primary">JD</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Jane Doe</h4>
                    <p className="text-sm text-muted-foreground">Designer at CreativeStudio</p>
                  </div>
                </div>
                <p className="text-muted-foreground">"ShiftBox has transformed how our design team shares large files with clients. The interface is so clean and simple."</p>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="font-medium text-primary">MS</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Mark Smith</h4>
                    <p className="text-sm text-muted-foreground">Developer at TechCorp</p>
                  </div>
                </div>
                <p className="text-muted-foreground">"The security features in ShiftBox give me peace of mind when sharing sensitive code files with my distributed team."</p>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="font-medium text-primary">AJ</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Alicia Johnson</h4>
                    <p className="text-sm text-muted-foreground">Project Manager at BuildRight</p>
                  </div>
                </div>
                <p className="text-muted-foreground">"We've significantly reduced file-related confusion since switching to ShiftBox. Our project documents are now all in one secure place."</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/30 to-background z-0"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 font-poppins bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Ready to transform your file sharing?</h2>
              <p className="text-xl text-foreground/80 font-space mb-10">Join thousands of professionals who trust ShiftBox with their most important files.</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild size="lg" className="rounded-full px-8 py-6 text-base font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300">
                  <Link to="/signup">Get started for free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 text-base font-medium border-primary text-primary hover:bg-primary/5">
                  <Link to="/contact">Contact sales</Link>
                </Button>
              </div>
              <div className="mt-12 pt-6 border-t border-primary/10 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-foreground/60">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t border-primary/10 py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                    <path d="M9 9h6v6H9z"></path>
                  </svg>
                </div>
                <span className="ml-3 text-2xl font-bold text-foreground font-poppins">ShiftBox</span>
              </div>
              <p className="text-foreground/70 mb-6 font-space">Secure, elegant file sharing for teams and individuals.</p>
              <div className="flex space-x-5">
                <a href="#" className="text-foreground/50 hover:text-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-foreground/50 hover:text-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
                <a href="#" className="text-foreground/50 hover:text-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.5 9.84c0-4.56-3.696-8.25-8.25-8.25-4.554 0-8.25 3.69-8.25 8.25 0 4.11 3.006 7.515 6.938 8.13v-5.754h-2.088v-2.376h2.088V7.794c0-2.058 1.227-3.195 3.104-3.195.9 0 1.84.162 1.84.162v2.016h-1.035c-1.026 0-1.347.633-1.347 1.284v1.539h2.292l-.366 2.376h-1.926v5.754c3.932-.615 6.938-4.02 6.938-8.13z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-5 font-space">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Security</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Enterprise</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-5 font-space">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Guides</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Support</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-5 font-space">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground/60 font-space">
              &copy; {new Date().getFullYear()} ShiftBox. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
