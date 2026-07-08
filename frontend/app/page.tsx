import { SmoothScroll } from "@/components/landing/smooth-scroll";
import { RevealObserver } from "@/components/landing/reveal-observer";
import { SiteNav } from "@/components/landing/site-nav";
import { Hero } from "@/components/landing/hero";
import { Compare } from "@/components/landing/compare";
import { About } from "@/components/landing/about";
import { Service } from "@/components/landing/service";
import { Steps } from "@/components/landing/steps";
import { Faq } from "@/components/landing/faq";
import { FooterDeco } from "@/components/landing/footer-deco";
import { Cta } from "@/components/landing/cta";
import { SiteFooter } from "@/components/landing/site-footer";

export default function Landing() {
  return (
    <SmoothScroll>
      <RevealObserver />
      <SiteNav />
      <main>
        <Hero />
        <Compare />
        <About />
        <Service />
        <Steps />
        <Faq />
      </main>
      <div className="relative overflow-clip bg-cream">
        <FooterDeco />
        <Cta />
        <SiteFooter />
      </div>
    </SmoothScroll>
  );
}
