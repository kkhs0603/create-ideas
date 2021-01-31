import React, { createContext, useEffect, useReducer } from "react";
import firebase from "../firebase/firebase";
import { useRouter } from "next/router";
import html2canvas from "html2canvas";
import loadImage from "blueimp-load-image";

interface Material {
  id: string;
  positionX: number;
  positionY: number;
  zIndex: number;
}

interface StickyNote extends Material {
  color: string;
  createdBy: string;
  word: string;
  width: number;
  height: number;
}

interface Line extends Material {
  vh: "vertical" | "horizontal";
}

interface Label extends Material {
  word: string;
  width: number;
  height: number;
  createdBy: string;
}

const MaterialType = {
  StickyNotes: "stickyNotes",
  Lines: "lines",
  Labels: "labels",
} as const;

type MaterialType = typeof MaterialType[keyof typeof MaterialType];

type Template = {
  name: string;
  labels: Array<Label>;
  lines: Array<Line>;
  stickyNotes: Array<StickyNote>;
  id: string;
  imageUrl: string;
  description: string;
};

interface IContextProps {
  enterCanvas: (canvasId: string) => void;
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
    materialName: string,
    id: string,
    zIndex: number
  ) => void;
  bringToFront: (canvasId: string, materialName: string, id: string) => void;
  sendBackward: (
    canvasId: string,
    materialName: string,
    id: string,
    zIndex: number
  ) => void;
  sendToBack: (canvasId: string, materialName: string, id: string) => void;
  isEdit: (createdBy: string) => boolean;
  labels: Array<Label>;
  addMaterial: (
    id: string,
    materialName: MaterialType,
    positionX: number,
    positionY: number,
    option: string
  ) => void;
  deleteMaterial: (
    canvasId: string,
    materialName: MaterialType,
    materialId: string
  ) => void;
  moveMaterial: (
    canvasId: string,
    materialName: MaterialType,
    materialId: string,
    x: number,
    y: number
  ) => void;
  editMaterialWord: (
    canvasId: string,
    materialName: MaterialType,
    materialId: string,
    word: string
  ) => void;
  resizeMaterial: (
    canvasId: string,
    materialName: MaterialType,
    materialId: string,
    positionX: number,
    positionY: number,
    width: number,
    height: number
  ) => void;
  lockMaterial: (
    canvasId: string,
    materialName: MaterialType,
    materialId: string,
    isLocked: boolean
  ) => void;
  templates: Array<Template>;
  user: any;
}

const MaterialsContext = createContext({} as IContextProps);
const db = firebase.firestore();
const MaterialsProvider: React.FC = ({ children }) => {
  const MaterialReducer = (
    materialsArray: Array<StickyNote> | Array<Line> | Array<Label>,
    action: {
      type: "added" | "modified" | "removed" | "initialize";
      material: StickyNote | Line | Label;
    }
  ) => {
    if (!materialsArray) return [];
    switch (action.type) {
      case "added":
        // console.log("add");
        if (materialsArray.length === 0) {
          return [action.material];
        }
        //既に入っている場合は、追加しない
        if (
          materialsArray
            .map((material) => material.id)
            .includes(action.material.id)
        ) {
          return materialsArray;
        }
        return [...materialsArray, action.material];
      case "modified":
        if (!materialsArray) break;
        const modifyArray = materialsArray;
        const modifyIndex = modifyArray.findIndex(
          (material) => material.id === action.material.id
        );
        if (modifyIndex < 0) return materialsArray;
        modifyArray[modifyIndex] = action.material;
        return [...modifyArray];
      case "removed":
        if (!materialsArray) break;
        const removeArray = materialsArray;
        const removeIndex = removeArray.findIndex(
          (material) => material.id === action.material.id
        );
        if (removeIndex < 0) return materialsArray;
        return removeArray.filter(
          (material) => material.id !== action.material.id
        );
      case "initialize":
        return [];
    }
  };

  const dispatchMaterial = (
    materialName: string,
    type: "added" | "modified" | "removed" | "initialize",
    material: StickyNote | Line | Label | {}
  ) => {
    if (!material) return;
    switch (materialName) {
      case MaterialType.StickyNotes:
        dispatchStickyNotes({ type: type, material: material });
        break;
      case MaterialType.Lines:
        dispatchLines({ type: type, material: material });
        break;
      case MaterialType.Labels:
        dispatchLabels({ type: type, material: material });
        break;
    }
  };
  const [stickyNotes, dispatchStickyNotes] = useReducer(MaterialReducer, []);
  const [lines, dispatchLines] = useReducer(MaterialReducer, []);
  const [labels, dispatchLabels] = useReducer(MaterialReducer, []);
  const auth = firebase.auth();
  const router = useRouter();

  const enterCanvas = async (canvasId: string) => {
    try {
      dispatchMaterial(MaterialType.StickyNotes, "initialize", []);
      dispatchMaterial(MaterialType.Lines, "initialize", []);
      dispatchMaterial(MaterialType.Labels, "initialize", []);
      await db.collection("canvases").doc(canvasId);
      await getAllMaterials(canvasId);
    } catch (error) {}
  };

  const getAllMaterials = async (canvasId: string) => {
    try {
      await getMaterial(canvasId, MaterialType.StickyNotes);
      await getMaterial(canvasId, MaterialType.Lines);
      await getMaterial(canvasId, MaterialType.Labels);
    } catch (error) {
      // console.log(error.message);
    }
  };

  /* --------------------------
  Material
  -------------------------- */
  const addMaterial = async (
    canvasId: string,
    materialName: MaterialType,
    positionX: number,
    positionY: number,
    option: string
  ) => {
    try {
      //z-idexの最大値取得
      const zIndeices = await getAllZindices(canvasId);
      const maxZindex =
        zIndeices.length !== 0 ? Math.max.apply(null, zIndeices) : 0;

      //ID生成
      const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const idLength = 20;
      let id = Array.from(Array(idLength))
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("");

      //ID被り時
      // const ref = await db
      //   .collection("canvases")
      //   .doc(canvasId)
      //   .collection(materialName)
      //   .doc(id);
      // while (!(await ref.get()).exists) {
      //   id = Array.from(Array(idLength)).map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
      // }

      //ローカルのMaterialsの配列に追加
      let newMaterial = {};
      switch (materialName) {
        case MaterialType.Labels:
          newMaterial = {
            positionX,
            positionY,
            word: "",
            width: 100,
            height: 100,
            createdBy: auth.currentUser.uid,
            isLocked: false,
            id: id,
            zIndex: maxZindex + 1,
            updatedBy: auth.currentUser.uid,
            updatedAt:
              new Date().toLocaleString("ja") +
              ":" +
              new Date().getMilliseconds(),
          };
          break;
        case MaterialType.Lines:
          newMaterial = {
            vh: option,
            positionX,
            positionY,
            isLocked: false,
            id: id,
            zIndex: maxZindex + 1,
            updatedBy: auth.currentUser.uid,
            updatedAt:
              new Date().toLocaleString("ja") +
              ":" +
              new Date().getMilliseconds(),
          };
          break;
        case MaterialType.StickyNotes:
          newMaterial = {
            word: "",
            positionX,
            positionY,
            width: 50,
            height: 50,
            createdBy: auth.currentUser.uid,
            color: option,
            zIndex: maxZindex + 1,
            isLocked: false,
            id: id,
            updatedBy: auth.currentUser.uid,
            updatedAt:
              new Date().toLocaleString("ja") +
              ":" +
              new Date().getMilliseconds(),
          };
          break;
      }
      dispatchMaterial(materialName, "added", newMaterial);

      //DB書き込み
      const ref = await db
        .collection("canvases")
        .doc(canvasId)
        .collection(materialName)
        .doc(id);
      switch (materialName) {
        case MaterialType.StickyNotes:
          await ref.set(newMaterial);
          break;

        case MaterialType.Lines:
          await ref.set(newMaterial);
          break;

        case MaterialType.Labels:
          await ref.set(newMaterial);
          break;
      }
      await updateCanvas(canvasId);
    } catch (error) {
      // console.log(error.message);
    }
  };

  const getMaterial = async (canvasId: string, materialName: MaterialType) => {
    try {
      // console.log("get " + materialName);
      const ref = await db
        .collection("canvases")
        .doc(canvasId)
        .collection(materialName);
      const result = ref.onSnapshot(
        { includeMetadataChanges: false },
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            dispatchMaterial(materialName, change.type, change.doc.data());
          });
        }
      );
      return result;
    } catch (error) {
      // console.log(error.message);
    }
  };

  const deleteMaterial = async (
    canvasId: string,
    materialName: MaterialType,
    materialId: string
  ): Promise<void> => {
    try {
      // console.log("delete ", materialName);
      const newMaterial = { id: materialId };
      dispatchMaterial(materialName, "removed", newMaterial);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(materialName)
        .doc(materialId)
        .delete();
      await updateCanvas(canvasId);
    } catch (error) {
      // console.log(error.message);
    }
  };

  const moveMaterial = async (
    canvasId: string,
    materialName: MaterialType,
    materialId: string,
    x: number,
    y: number
  ): Promise<void> => {
    try {
      // console.log("move ", materialName);

      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(materialName)
        .doc(materialId)
        .update({
          positionX: x,
          positionY: y,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
        });
      await updateCanvas(canvasId);
    } catch (error) {
      // console.log(error.message);
    }
  };

  const editMaterialWord = async (
    canvasId: string,
    materialName: MaterialType,
    materialId: string,
    word: string
  ) => {
    try {
      // console.log("edit " + materialName + " word");
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(materialName)
        .doc(materialId)
        .update({
          word: word,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
        });
      await updateCanvas(canvasId);
    } catch (error) {
      // console.log(error.message);
    }
  };

  const resizeMaterial = async (
    canvasId: string,
    materialName: MaterialType,
    materialId: string,
    positionX: number,
    positionY: number,
    width: number,
    height: number
  ) => {
    try {
      // console.log("resize", materialName);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(materialName)
        .doc(materialId)
        .update({
          positionX,
          positionY,
          width,
          height,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
        });
      await updateCanvas(canvasId);
    } catch (error) {
      // console.log(error.message);
    }
  };

  const lockMaterial = async (
    canvasId: string,
    materialName: MaterialType,
    materialId: string,
    isLocked: boolean
  ) => {
    try {
      // console.log("lock " + materialName);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(materialName)
        .doc(materialId)
        .update({
          isLocked,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
        });
      await updateCanvas(canvasId);
    } catch (error) {
      // console.log(error.message);
    }
  };

  /* --------------------------
  stickyNote
  -------------------------- */
  const changeStickyNoteColor = async (
    canvasId: string,
    stickyNoteId: string,
    color: string
  ) => {
    try {
      // console.log("change stickyNote color : " + color);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection("stickyNotes")
        .doc(stickyNoteId)
        .update({
          color: color,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
        });
      await updateCanvas(canvasId);
    } catch (error) {
      // console.log(error.message);
    }
  };

  const isEdit = (createdBy: string) => {
    return auth.currentUser.uid === createdBy;
  };

  const updateCanvasChangedTime = async (canvasId: string) => {
    try {
      await db
        .collection("canvases")
        .doc(canvasId)
        .update({
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
        });
    } catch (error) {
      // console.log(error.message);
    }
  };

  const updateCanvas = async (canvasId: string) => {
    updateCanvasChangedTime(canvasId);
    updateThumbnail(canvasId);
  };
  /* --------------------------
  toBack/toFront
  -------------------------- */

  //前面へ
  const bringForward = async (
    canvasId: string,
    materialName: string,
    id: string,
    zIndex: number
  ) => {
    try {
      // console.log("bringFoward : " + materialName);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(materialName)
        .doc(id)
        .update({
          zIndex: zIndex + 1,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
        });
      await updateCanvas(canvasId);
    } catch (error) {
      // console.log(error.message);
    }
  };

  //最前面へ
  const bringToFront = async (
    canvasId: string,
    materialName: string,
    id: string
  ) => {
    try {
      // console.log("bringToFront : " + materialName);
      const zIndeices = await getAllZindices(canvasId);
      // console.log(zIndeices);
      const maxZindex = Math.max.apply(null, zIndeices);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(materialName)
        .doc(id)
        .update({
          zIndex: maxZindex + 1,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
        });
      await updateCanvas(canvasId);
    } catch (error) {
      // console.log(error.message);
    }
  };

  //背面へ
  const sendBackward = async (
    canvasId: string,
    materialName: string,
    id: string,
    zIndex: number
  ) => {
    try {
      // console.log("sendBackward : " + materialName);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(materialName)
        .doc(id)
        .update({
          zIndex: zIndex - 1,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
        });
      await updateCanvas(canvasId);
    } catch (error) {
      // console.log(error.message);
    }
  };

  //最背面へ
  const sendToBack = async (
    canvasId: string,
    materialName: string,
    id: string
  ) => {
    try {
      // console.log("sendToBack : " + materialName);
      const zIndeices = await getAllZindices(canvasId);
      const maxZindex = Math.min.apply(null, zIndeices);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(materialName)
        .doc(id)
        .update({
          zIndex: maxZindex - 1,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
        });
      await updateCanvas(canvasId);
    } catch (error) {
      // console.log(error.message);
    }
  };

  //全オブジェクトのzIndex取得
  const getAllZindices = async (canvasId: string) => {
    const wordsRef = await db
      .collection("canvases")
      .doc(canvasId)
      .collection("stickyNotes");
    const words = await (await wordsRef.get()).docs;
    const zIndices = words.map((word) => word.data().zIndex);

    const linesRef = await db
      .collection("canvases")
      .doc(canvasId)
      .collection("lines");
    const lines = await (await linesRef.get()).docs;
    const linesZindices = lines.map((line) => line.data().zIndex);
    const result = zIndices.concat(linesZindices);
    return result;
  };

  const updateThumbnail = async (canvasId: string) => {
    try {
      const target = document.getElementById("area");
      const canvas = await html2canvas(target);
      const dataUrl = canvas.toDataURL("image/png");
      const result = await loadImage(dataUrl, {
        maxWidth: 300,
        canvas: true,
      });
      result.image.toBlob(async (blob: Blob) => {
        const storageResult = await firebase
          .storage()
          .ref(`/images/thumbnails/${canvasId}`)
          .put(blob);
        //Canvasにサムネイル画像のURLがなければ入れる
        const url = await storageResult.ref.getDownloadURL();
        const canvasRef = await db.collection("canvases").doc(canvasId);
        await canvasRef.get();
        canvasRef.update({ thumbnailUrl: url });
      });
    } catch (error) {
      // console.log(error.message);
    }
  };

  return (
    <MaterialsContext.Provider
      value={{
        enterCanvas,

        addMaterial,
        deleteMaterial,
        moveMaterial,
        editMaterialWord,
        resizeMaterial,
        lockMaterial,

        changeStickyNoteColor,
        bringForward,
        bringToFront,
        sendBackward,
        sendToBack,

        isEdit,
        getAllMaterials,

        lines,
        stickyNotes,
        labels,
      }}
    >
      {children}
    </MaterialsContext.Provider>
  );
};

export { MaterialsContext, MaterialsProvider };
