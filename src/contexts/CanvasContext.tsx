// @ts-nocheck
import React, { useState, createContext, useEffect, useReducer } from "react";
import firebase, { storage } from "../firebase/firebase";
import { useRouter } from "next/router";

type Canvas = {
  //TODO:型直す
  createdAt: Date;
  createdBy: string;
  name: string;
  updatedAt: Date;
};

type Template = {
  name: string;
  labels: Array<Label>;
  lines: Array<Line>;
  stickyNotes: Array<StickyNote>;
  id: string;
  imageUrl: string;
  description: string;
};

const MaterialType = {
  StickyNotes: "stickyNotes",
  Lines: "lines",
  Labels: "labels",
} as const;

type MaterialType = typeof MaterialType[keyof typeof MaterialType];

//interface
interface IContextProps {
  createCanvas: (canvasName: string, templateId: string) => void;
  canvases: Array<Canvas>;
  enterCanvas: (canvasId: string) => void;
  joinedUsers;
  getAllMaterials: (canvasId: string) => void;
  stickyNotes: Array<StickyNote>;
  changeStickyNoteColor: (
    canvasId: string,
    stickyNoteId: string,
    color: string
  ) => void;
  lines: Array<Line>;

  bringForward: (
    canvasId: string,
    objName: string,
    id: string,
    zIndex: number
  ) => void;
  bringToFront: (canvasId: string, objName: string, id: string) => void;
  sendBackward: (
    canvasId: string,
    objName: string,
    id: string,
    zIndex: number
  ) => void;
  sendToBack: (canvasId: string, objName: string, id: string) => void;
  isEdit: (createdBy: string) => boolean;
  labels: Array<Label>;

  addMaterial: (
    id: string,
    objName: MaterialType,
    positionX: number,
    positionY: number,
    option: string
  ) => void;
  deleteMaterial: (
    canvasId: string,
    objName: MaterialType,
    objId: string
  ) => void;
  moveMaterial: (
    canvasId: string,
    objName: MaterialType,
    objId: string,
    x: number,
    y: number
  ) => void;
  editMaterialWord: (
    canvasId: string,
    objName: MaterialType,
    objId: string,
    word: string
  ) => void;
  resizeMaterial: (
    canvasId: string,
    objName: MaterialType,
    objId: string,
    positionX: number,
    positionY: number,
    width: number,
    height: number
  ) => void;
  lockMaterial: (
    canvasId: string,
    objName: MaterialType,
    objId: string,
    isLocked: boolean
  ) => void;
  templates: Array<Template>;
  user: any;
}

const CanvasContext = createContext({} as IContextProps);
const db = firebase.firestore();
const CanvasProvider: React.FC = ({ children }) => {
  const [canvases, setCanvases] = useState<Array<Canvas>>([]);
  const [canvasData, setCanvasData] = useState<Canvas>();
  const [templates, setTemplates] = useState<Array<Template>>([]);
  const auth = firebase.auth();
  const router = useRouter();

  /* --------------------------
  Canvas
  -------------------------- */
  const createCanvas = async (canvasName: string, templateId: string) => {
    try {
      const templateRef = await db
        .collection("templates")
        .doc(templateId)
        .get();
      const collectionId =
        auth.currentUser.uid === process.env.TEST_USER_ID
          ? "testCanvases"
          : "canvases";
      const result = await db.collection(collectionId).add({
        name: canvasName,
        ideas: [],
        joinedUsers: [],
        createdAt:
          new Date().toLocaleString("ja") + ":" + new Date().getMilliseconds(),
        createdBy: auth.currentUser.uid,
        updatedAt:
          new Date().toLocaleString("ja") + ":" + new Date().getMilliseconds(),
      });

      await db.collection(collectionId).doc(result.id).update({
        id: result.id,
      });
      const stickyNotesRef = await db
        .collection("templates")
        .doc(templateId)
        .collection(MaterialType.StickyNotes)
        .get();
      const stickyNotes = stickyNotesRef.docs.map((stickyNote) =>
        stickyNote.data()
      );

      const linesRef = await db
        .collection("templates")
        .doc(templateId)
        .collection(MaterialType.Lines)
        .get();
      const lines = linesRef.docs.map((line) => line.data());

      const labelsRef = await db
        .collection("templates")
        .doc(templateId)
        .collection(MaterialType.Labels)
        .get();
      const labels = labelsRef.docs.map((label) => label.data());

      // console.log("stickyNotes writing");
      await stickyNotes.forEach(async (stickyNote) => {
        const stickyResult = await result
          .collection(MaterialType.StickyNotes)
          .add(stickyNote);
        result
          .collection(MaterialType.StickyNotes)
          .doc(stickyResult.id)
          .update({
            id: stickyResult.id,
            updatedBy: auth.currentUser.uid,
            updatedAt:
              new Date().toLocaleString("ja") +
              ":" +
              new Date().getMilliseconds(),
          });
      });
      // console.log("labels writing");
      await labels.forEach(async (label) => {
        const labelResult = await result
          .collection(MaterialType.Labels)
          .add(label);
        result
          .collection(MaterialType.Labels)
          .doc(labelResult.id)
          .update({
            id: labelResult.id,
            updatedBy: auth.currentUser.uid,
            updatedAt:
              new Date().toLocaleString("ja") +
              ":" +
              new Date().getMilliseconds(),
          });
      });
      // console.log("lines writing");
      await lines.forEach(async (line) => {
        const lineResult = await result
          .collection(MaterialType.Lines)
          .add(line);
        result
          .collection(MaterialType.Lines)
          .doc(lineResult.id)
          .update({
            id: lineResult.id,
            updatedBy: auth.currentUser.uid,
            updatedAt:
              new Date().toLocaleString("ja") +
              ":" +
              new Date().getMilliseconds(),
          });
      });

      // console.log("new canvas created!");
      router.push("/canvases/" + result.id);
    } catch (error) {
      // console.log(error);
    }
  };

  const getCanvases = async () => {
    try {
      const collectionId =
        auth.currentUser.uid === process.env.TEST_USER_ID
          ? "testCanvases"
          : "canvases";
      const canvasesRef = await db.collection(collectionId);
      canvasesRef.onSnapshot((snapshot) => {
        setCanvases([]);
        setCanvases(snapshot.docs.map((canvas) => canvas.data()));
      });

      // unsubscribe();
    } catch (error) {
      // console.log(error);
    }
  };

  /* --------------------------
  Template
  -------------------------- */
  const getTemplates = async () => {
    const ref = await db.collection("templates");
    const docs = await (await ref.get()).docs;
    const temps = await docs.map((doc) => doc.data());
    setTemplates(temps);
  };

  const uploadTemplate = async () => {
    const ref = await db.collection("templates");
    const result = await ref.add({ name: "PDCA" });

    stickyNotes.map((stickyNote) =>
      ref.doc(result.id).collection(MaterialType.StickyNotes).add(stickyNote)
    );
    labels.map((label) =>
      ref.doc(result.id).collection(MaterialType.Labels).add(label)
    );
    lines.map((line) =>
      ref.doc(result.id).collection(MaterialType.Lines).add(line)
    );
  };

  useEffect(() => {}, []);

  return (
    <CanvasContext.Provider
      value={{
        createCanvas,
        canvases,

        uploadTemplate,
        templates,
        canvasData,

        getCanvases,
        getTemplates,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasContext, CanvasProvider };
