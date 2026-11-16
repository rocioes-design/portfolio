import { Footer, Header } from "./components";
import { HomeCloth } from "./home-cloth";

export default function Home() {
  return <>
  <div className="page-shell"><Header nav={false} /></div>
  <div className="framer-home">
  <main className="framer-home__main">
    <section className="cloth-section"><HomeCloth /></section>
  </main>
    <Footer />
  </div>
  </>;
}
