import React, { useContext } from "react";
import { CanvasContext } from "../contexts/CanvasContext";
import Layout from "../components/templates/Layout/Layout";
import CreateCanvas from "../components/organisms/CreateCanvas";
import SelectCanvas from "../components/organisms/SelectCanvas";

const CanvasesPage = () => {
  const { canvases } = useContext(CanvasContext);

  return (
    <Layout>
      <CreateCanvas />
      <div>Canvas一覧</div>
      <SelectCanvas canvases={canvases} />
    </Layout>
  );
};

export default CanvasesPage;
