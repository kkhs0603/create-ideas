import React, { useContext, useEffect } from "react";
import { CanvasContext } from "../contexts/CanvasContext";
import Layout from "../components/templates/Layout/Layout";
import { TextField, Button, Avatar } from "@material-ui/core";

const CanvasPage = (props) => {
  const { enterCanvas, joinedUsers } = useContext(CanvasContext);
  const canvasId = props.location.state.canvasId;
  useEffect(() => {
    enterCanvas(canvasId);
  }, []);
  const users = joinedUsers.map((user) => <div key={user}>{user.name}</div>);

  return (
    <Layout>
      {users}
      <TextField></TextField>
      <Button type="submit" fullWidth variant="contained" color="primary">
        送信
      </Button>
    </Layout>
  );
};

export default CanvasPage;
