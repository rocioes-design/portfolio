import Link from "next/link";
import { Footer, Header } from "../components";

export default function CaseStudy() {
  return <main><div className="page-shell"><Header />
    <section className="case-hero"><div><span className="eyebrow">Case study · 2026</span><h1>Subsure</h1><p>All your subscriptions, in one view.</p><Link href="#overview">Read case study <span>↓</span></Link></div><div className="case-phone"><span>Welcome to</span><strong>Subsure</strong><h3>Keep track of every subscription.</h3><div className="case-total">$84.97 <small>/ month</small></div><div className="case-pill">Expenses overview <b>›</b></div><div className="case-pill">All subscriptions <b>›</b></div></div></section>
    <section id="overview" className="case-intro"><span>01 — Context</span><h2>Subscriptions are easy to start and surprisingly hard to stay on top of.</h2><p>Subsure makes recurring expenses feel visible and manageable, so people can make decisions before their card gets charged.</p></section>
    <section className="quote">“I just want to know what I’m paying for before my card gets hit again.”</section>
    <section className="case-grid"><article><span>02 — Research</span><h2>From uncertainty to a clear daily view.</h2><p>Interviews highlighted a familiar problem: people remembered the services they loved, but not every renewal date or price change.</p></article><article><span>03 — Result</span><h2>A calmer way to manage recurring payments.</h2><p>The product centers the information people need most: what is due, what has changed, and what is worth keeping.</p></article></section>
    <section className="case-screen"><div><small>Current spend</small><h2>$84.97<span>/month</span></h2><div className="bar one" /><div className="bar two" /><div className="bar three" /></div><div><small>Due in 10 days</small><h3>Netflix</h3><p>Next payment · $15.49</p><button>View subscription →</button></div></section>
    <Footer />
  </div></main>;
}
