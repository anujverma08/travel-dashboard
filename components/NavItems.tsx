import React from "react";
import { sidebarItems } from "~/constants";
import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import { cn } from "~/lib/utils";

const NavItems = ({ handleClick }: {handleClick?: () => void}) => {

  const user = useLoaderData();
  // Assuming user data is loaded via a loader function
  // and contains properties like imageUrl, name, and email.
  const navigate = useNavigate();


  return (
    <section className="nav-items">
      <Link to="/" className="link-logo">
        <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
        <h1>Tourvisto</h1>
      </Link>

      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <NavLink to={href} key={id}>
              {({ isActive }: { isActive: boolean }) => (
                <div
                  className={cn("grip nav-item", {
                    "bg-primary-100 !text-white": isActive,
                  })} onClick={handleClick}
                >
                  <img
                    src={icon}
                    alt={label}
                    className={`group-hover:brightness-0 size-0 group-hover:insert ${
                      isActive ? "brightness-0 invert" : "text-dark-200"
                    }`}
                  />
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <footer className="nav-footer">
            <img src = {user?.imageUrl || '/assests/images/david.webp'} alt={user?.name} />
                <article>
                    <h2>{user?.name}</h2>
                    <p>{user?.email}</p>
                </article>

                <button 
                    onClick={() => {
                        console.log("Logout clicked");
                    }}
                    className="cursor-pointer"
                    >
                    <img src="/assets/icons/logout.svg" alt="logout" className="size-6" />
                    </button>
        </footer>
      </div>
    </section>
  );
};

export default NavItems;
