import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { NavLinkProps } from "./NavLink.types";
import "./NavLinkStyles.scss";

const NavLink = ({ label, to, icon }: NavLinkProps) => {
  let match = useRouteMatch({
    path: to,
    exact: true,
  });

  return (
    <Link className={match ? "nav-link nav-link-avtive" : "nav-link"} to={to}>
      <img className="nav-link-icon" src={icon} alt="posts" />
      <p>{label}</p>
    </Link>
  );
};

export default NavLink;
