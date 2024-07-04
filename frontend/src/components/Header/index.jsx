import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "../../redux/auth";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

import styles from "./Header.module.scss";

export const Header = () => {
  const dispatch = useDispatch();

  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      dispatch(logout());
      window.localStorage.removeItem("token");
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>React-Dev Blog</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Write an Article</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Create Account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
