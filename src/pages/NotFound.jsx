import { Link } from "react-router-dom";

const NotFound = () => (

  <main className="not-found-page">
    <span>404</span>
    <h1>Page not found</h1>
    <p>The page you are looking for does not exist.</p>
    <Link to="/">Return home</Link>
  </main>
);

export default NotFound;
