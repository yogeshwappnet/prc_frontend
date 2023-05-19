import { DataGrid } from "@mui/x-data-grid";
import React, { ChangeEvent, useEffect, useState } from "react";
import useNotification from "../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import CampaignService from "../services/CampaignService";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField } from "@mui/material";
import { useNavigationInterceptor } from "../AxiosInterceptor";

const Campaigns: React.FC = () => {
  const navigate = useNavigate();
  const [tempData, setTempData] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const [status, setStatus] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  const [search, setSearch] = React.useState("");

  const handleSearch = (event) => {
    setSearch(event.target.value as string);
  };

  const filterData = () => {
    let filteredData = tempData;

    if (status !== "") {
      // eslint-disable-next-line array-callback-return
      filteredData = filteredData.filter((data) => {
        if (data.status === status) {
          return data;
        }
      });
    }

    if (search !== "") {
      filteredData = filteredData.filter((data) => {
        if (data.name.toLowerCase().includes(search.toLowerCase())) {
          return data;
        }
      });
    }

    setTableData(filteredData);
    setRowCount(filteredData.length);
  };

  useEffect(() => {
    filterData();
  }, [search, status]);

  useEffect(() => {
    getCampaign();
  }, []);

  const getCampaign = () => {
    CampaignService.getCampaigns().then(
      (response: any) => {
        if (response.data?.data.length > 0) {
          response.data.data = response.data.data.map((data) => {
            data["id"] = data._id;
            return data;
          });
          setRowCount(response.data?.data.length);
        }

        setTableData(response.data?.data);
        setTempData(response.data?.data);
      }
    );
  };

  const iconSize = {
    fontSize: { xs: "20px", md: "22px", lg: "24px" }
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "receipts", headerName: "#Receipts", flex: 1 },
    { field: "replies", headerName: "#Replies", flex: 1 },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      width: 140,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
            <EditIcon
              color="primary"
              sx={iconSize}
              onClick={() => {
                editCampaign(params.row.id);
              }}
            />
          </div>
        );
      }
    },
  ];

  const editCampaign = (id) => {
    navigate(`/dashboard/edit/${id}`);
  };

  return (
    <>
      <div style={{ minHeight: 200, marginTop: "30px" }}>
        <div className="mb-16">
          <FormControl sx={{ width: 300 }}>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Status"
              value={status}
              onChange={handleChange}
            >
              <MenuItem value={""}>All</MenuItem>
              <MenuItem value={"Active"}>Active</MenuItem>
              <MenuItem value={"In Active"}>In Active</MenuItem>
            </Select>
          </FormControl>

          <TextField
            sx={{ ml: 4, width: 400 }}
            value={search}
            onChange={handleSearch}
            id="outlined-basic"
            label="Search Campaign"
            variant="outlined"
          />
        </div>
        <DataGrid
          rowCount={rowCount}
          rows={tableData}
          columns={columns}
          getRowId={(row) => row.id}
          sx={{ backgroundColor: "#fff", overflowY: "scroll" }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>
    </>
  );
};

export default Campaigns;
