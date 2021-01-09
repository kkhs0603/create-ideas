import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "../../contexts/AuthContext";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Button,
  Icon,
} from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    margin: "0 auto",
  },
}));

const Header = () => {
  const classes = useStyles();
  const {
    user,
    signout,
    handleGoUserSetting,
    handleGoBack,
    router,
  } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // console.log(router.pathname);
  return (
    <AppBar>
      <Toolbar>
        <div className={classes.root}>
          {router.pathname === "/" ? (
            <></>
          ) : (
            <IconButton onClick={handleGoBack} aria-controls="menu-appbar">
              <KeyboardBackspaceIcon style={{ color: "white" }} />
            </IconButton>
          )}
          <div className={classes.title}>Create Ideas</div>
          {user == null ? (
            <></>
          ) : (
            <div>
              {user.displayName}
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar alt="user" src={user.photoURL} />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleGoUserSetting}>設定</MenuItem>
                <MenuItem onClick={signout}>サインアウト</MenuItem>
              </Menu>
            </div>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
