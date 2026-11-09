import { Link } from "react-router-dom";

const Home = () => (

  <main className="home-page">
    <nav className="home-nav">
      <Link to="/" className="home-brand">SkillBridge</Link>
      <div>
        <Link to="/login">Log in</Link>
        <Link to="/register">Create account</Link>
      </div>
    </nav>
    <section className="home-hero">
      <span className="hero-eyebrow">STUDENT SKILLS • PROJECTS • COMMUNITY</span>
      <h1>Turn your skills into <span>real projects.</span></h1>
      <p>Discover student talent, share your work, and find people to build with.</p>
      <div className="hero-actions">
        <Link to="/register">Get started</Link>
        <Link to="/projects">Explore projects</Link>
      </div>
    </section>
  </main>
);

export default Home;
