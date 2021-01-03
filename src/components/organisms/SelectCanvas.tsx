import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { useRouter } from "next/router";
const SelectCanvas = (props) => {
  const canvases = props.canvases;
  const router = useRouter();
  if (!canvases) return <></>;

  const columns = [
    {
      field: "canvasName",
      headerName: "Canvas名",
      flex: 1,
      disableClickEventBubbling: true,
    },
    {
      field: "author",
      headerName: "作成者",
      flex: 1,
      disableClickEventBubbling: true,
    },
    {
      field: "updatedTime",
      headerName: "更新日時",
      flex: 1,
      disableClickEventBubbling: true,
    },
    {
      field: "createdTime",
      headerName: "作成日時",
      flex: 1,
      disableClickEventBubbling: true,
    },
    {
      field: "enterCanvas",
      headerName: " ",
      flex: 1,
      disableClickEventBubbling: true,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          fullwidth
          onClick={() =>
            router.push("/Canvases/[id]", `/Canvases/${params.value}`)
          }
        >
          Enter Canvas
        </Button>
      ),
    },
  ];
  const rows = canvases.map((canvas, index) => {
    return {
      id: canvas.id,
      canvasName: canvas.name,
      author: canvas.createdBy,
      updatedTime: canvas.updatedAt,
      createdTime: canvas.createdAt,
      enterCanvas: canvas.id,
    };
  });
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnFilter
        pageSize={10}
        rowsPerPageOptions={[10, 20]}
        sortModel={[
          {
            field: "updatedTime",
            sort: "desc",
          },
        ]}
      />
    </div>
  );
};

export default SelectCanvas;
