import Image from "next/image";
import { FaInstagram, FaLinkedin } from "react-icons/fa6";
import { MdEmail, MdLanguage, MdLocationOn, MdPhone } from "react-icons/md";

const LINKS = [
     { href: "/#home", label: "Home" },
     { href: "/#how", label: "How it works" },
     { href: "/#playground", label: "Playground" },
     { href: "/#product", label: "Product" },
     { href: "/#pricing", label: "Pricing" },
];

const SERVICES = ["Rooms for every department", "Automatic depreciation", "Roles & invite codes", "Value history per asset"];

export function HomeFooter() {
     return (
          <footer id="contact" className="relative w-full scroll-mt-20 overflow-hidden border-t border-white/10 bg-[#0a0a0a] pt-16 lg:pt-24">
               <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                         <div className="lg:col-span-4">
                              <Image src="/brand/cybox-wordmark.png" alt="Cybox" width={900} height={234} className="h-auto w-36" />
                              <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
                                   Strategic asset management: monitor, value and optimize everything your company owns.
                              </p>
                              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-primary">Know what you own. Know what it&apos;s worth.</p>
                         </div>

                         <div className="lg:col-span-2">
                              <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-white/55">Explore</h3>
                              <ul className="space-y-2.5">
                                   {LINKS.map(l => (
                                        <li key={l.href}><a href={l.href} className="text-sm text-white/70 transition-colors hover:text-primary">{l.label}</a></li>
                                   ))}
                                   <li><a href="/privacy" className="text-sm text-white/70 transition-colors hover:text-primary">Privacy policy</a></li>
                                   <li><a href="/terms" className="text-sm text-white/70 transition-colors hover:text-primary">Terms of use</a></li>
                              </ul>
                         </div>

                         <div className="lg:col-span-3">
                              <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-white/55">Product</h3>
                              <ul className="space-y-2.5">
                                   {SERVICES.map(s => <li key={s} className="text-sm text-white/70">{s}</li>)}
                              </ul>
                         </div>

                         <div className="lg:col-span-3">
                              <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-white/55">Contact</h3>
                              <div className="space-y-3 text-sm">
                                   <a href="mailto:contact@adapto-sh.com" className="flex items-center gap-3 text-white/70 transition-colors hover:text-primary">
                                        <MdEmail className="text-primary" size={18} aria-hidden /> contact@adapto-sh.com
                                   </a>
                                   <a href="tel:+16727553873" className="flex items-center gap-3 text-white/70 transition-colors hover:text-primary">
                                        <MdPhone className="text-primary" size={18} aria-hidden /> +1 (672) 755-3873
                                   </a>
                                   <a href="https://www.adapto-sh.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/70 transition-colors hover:text-primary">
                                        <MdLanguage className="text-primary" size={18} aria-hidden /> adapto-sh.com
                                   </a>
                                   <p className="flex items-center gap-3 text-white/70">
                                        <MdLocationOn className="text-primary" size={18} aria-hidden /> Vancouver, BC, Canada
                                   </p>
                              </div>
                              <div className="mt-6 flex gap-3">
                                   <a href="https://www.linkedin.com/company/adapto-sh" target="_blank" rel="noopener noreferrer" aria-label="Adapto on LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-primary hover:text-primary">
                                        <FaLinkedin size={18} />
                                   </a>
                                   <a href="https://www.instagram.com/adapto_sh" target="_blank" rel="noopener noreferrer" aria-label="Adapto on Instagram (@adapto_sh)" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-primary hover:text-primary">
                                        <FaInstagram size={18} />
                                   </a>
                              </div>
                         </div>
                    </div>

                    <div className="mt-16 flex flex-col items-center justify-between gap-2 border-t border-white/10 py-6 text-center font-mono text-xs text-white/55 sm:flex-row sm:text-left">
                         <p>© {new Date().getFullYear()} Cybox. All rights reserved.</p>
                         <p>A project built by the <a href="https://www.adapto-sh.com" target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-white">Adapto Software House Inc.</a> team · Vancouver, BC</p>
                    </div>
               </div>

               {/* giant outlined wordmark peeking from the bottom */}
               <p aria-hidden className="pointer-events-none select-none bg-gradient-to-b from-primary/25 via-primary/[0.06] to-transparent bg-clip-text text-center font-display text-[22vw] font-semibold leading-[0.8] tracking-tighter text-transparent">
                    CYBOX
               </p>
          </footer>
     )
}
