import { AppBar, Toolbar } from "@mui/material";
import React from "react";
import Logo from "./shared/Logo";
import NavigationLink from "./shared/NavigationLink";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const auth = useAuth();
  return (
    <AppBar
      sx={{
        bgcolor: "transparent",
        position: "static",
        boxShadow: "none",
        width: "100",
      }}
    >
      <Toolbar sx={{ display: "flex" }}>
        <Logo />
        <div>
          {auth?.isLoggedIn ? (
            <>
              <NavigationLink
                bg="transparent"
                to="/chat"
                text="Go To Chat"
                textColor="#51538f"
              />
              <NavigationLink
                bg="transparent"
                textColor="#51538f"
                to="/"
                text="logout"
                onClick={auth.logout}
              />
            </>
          ) : (
            <>
              <NavigationLink
                bg="transparent"
                to="/login"
                text="Login"
                textColor="#51538f"
              />
              <NavigationLink
                bg="#51538f"
                textColor="white"
                to="/signup"
                text="Sign Up"
              />
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
