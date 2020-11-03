import React, { useContext } from "react";
import { CanvasContext } from "../contexts/CanvasContext";
import Layout from "../components/templates/Layout/Layout";
import CreateCanvas from "../components/organisms/CreateCanvas";
import SelectCanvas from "../components/organisms/SelectCanvas";
import firebase from "../firebase/firebase";

export async function getServerSideProps() {
  const db = firebase.firestore();
  const canvases = [];
  const result = await new Promise(async (resolve, reject) => {
    try {
      const canvasesRef = await db.collection("canvases");
      canvasesRef.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          canvases.push({
            id: change.doc.id,
            name: change.doc.data().name,
            createdBy: change.doc.data().createdBy,
            createdAt: change.doc.data().createdAt.toDate(),
          });
        });
        resolve(JSON.stringify(canvases));
      });
    } catch (error) {
      reject([]);
    }
  });
  return {
    props: {
      canvases: result,
    },
  };
}

const CanvasListPage = ({ canvases }) => {
  const canvasesObj = JSON.parse(canvases);
  return (
    <Layout>
      <CreateCanvas />
      <div>Canvas一覧</div>
      <SelectCanvas canvases={canvasesObj} />
    </Layout>
  );
};

export default CanvasListPage;
