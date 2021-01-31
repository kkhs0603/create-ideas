import React from "react";
import Layout from "../components/templates/Layout/Layout";
import { Button, TextField, Avatar, Container } from "@material-ui/core";
import { useUserSetting } from "../hooks/useUserSetting";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  section: {
    margin: "0 auto",
    padding: 20,
    maxWidth: 600,
  },
  avatar: {
    width: 300,
    height: 300,
    margin: "0 auto",
  },
}));

const UserSettingsPage = () => {
  const [
    updateUserSetting,
    handleUserNameOnChanged,
    username,
    handleGoBack,
    imageUrl,
    handleSaveTempImage,
    user,
  ] = useUserSetting();
  const classes = useStyles();
  return (
    <Layout>
      <Container>
        <Avatar alt="user" src={imageUrl} className={classes.avatar} />
        <div className={classes.section}>
          <div>プロフィール画像</div>
          <input
            type="file"
            onChange={handleSaveTempImage}
            disabled={user?.uid === process.env.TEST_USER_ID}
          />
        </div>

        <div className={classes.section}>
          <div>ユーザー名</div>
          <TextField
            // className={classes.textField}
            id="username"
            type="text"
            autoComplete="off"
            helperText={""}
            variant="outlined"
            defaultValue={username}
            onChange={handleUserNameOnChanged}
            fullWidth
            disabled={user?.uid === process.env.TEST_USER_ID}
          />
        </div>
        <div className={classes.section}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={updateUserSetting}
            disabled={user?.uid === process.env.TEST_USER_ID}
          >
            更新
          </Button>
        </div>
      </Container>
    </Layout>
  );
};

export default UserSettingsPage;
