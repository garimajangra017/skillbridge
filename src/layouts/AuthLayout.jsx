import { Outlet, Link } from "react-router-dom";

const AuthLayout = () => (

  <main className="auth-layout">
    <Link className="auth-brand" to="/">SkillBridge</Link>
    <Outlet />
  </main>
);

export default AuthLayout;
