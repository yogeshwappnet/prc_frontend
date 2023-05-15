import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import useNotification from "../hooks/useNotification";
import { useNavigate, useParams } from "react-router-dom";

type AddCampaignForm = {
  name: string;
  status: string;
  forwardIncomingCall: boolean;
  forwardIncomingCallNumber: string;
  receipts: string;
  timeOfDay: string;
};

const AddCampaign: React.FC = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  return (
    <>
      <Box component="form">
        <Grid
          container
          spacing={12}
          sx={{ mb: 4, alignItems: "center", justifyContent: "space-between" }}
        >
          <Grid item xs={5}>
            <TextField
              sx={{ width: "100%" }}
              id="filled-multiline-static"
              label="Campaign Name"
            />
          </Grid>
          <Grid item xs={4}>
            <label> Status: </label>{" "}
            <Switch inputProps={{ "aria-label": "controlled" }} />{" "}
            <label> Active</label>
          </Grid>
        </Grid>
        <Divider sx={{ my: 1, mb: 3 }} />
        <Grid
          container
          spacing={12}
          sx={{
            mb: 3,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid item xs={4}>
            <Button type="submit" fullWidth variant="contained">
              Edit Filters
            </Button>
          </Grid>
          <Grid item xs={4}>
            <TextField
              type="time"
              sx={{ width: "100%" }}
              id="filled-multiline-static"
              label="Time of the Day"
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 1 }} />
        <Grid
          container
          spacing={2}
          sx={{
            mt: 2,
            mb: 2,
            justifyContent: "space-between",
          }}
        >
          <Grid item xs={7}>
            <TextField
              sx={{ width: "100%", mb: 2 }}
              id="filled-multiline-static"
              label="Message 1"
              multiline
              rows={4}
            />
            <div className="interval">
              Interval:
              <TextField
              sx={{width: "8%", ml: 2, mr: 2}}
                id="outlined-basic"
                label=""
                variant="outlined"
              />
              days after first message.
            </div>

            <TextField
              sx={{ width: "100%", mb: 2 }}
              id="filled-multiline-static"
              label="Message 2"
              multiline
              rows={4}
            />
            <div className="interval">
              Interval:
              <TextField
              sx={{width: "8%", ml: 2, mr: 2}}
                id="outlined-basic"
                label=""
                variant="outlined"
              />
              days after first message.
            </div>
            <TextField
              sx={{ width: "100%", mb: 2 }}
              id="filled-multiline-static"
              label="Message 3"
              multiline
              rows={4}
            />
            <Button
              type="submit"
              sx={{
                mt: 2,
              }}
              fullWidth
              variant="contained"
            >
              Add Message
            </Button>
            <Button
              type="submit"
              sx={{
                mt: 2,
                width: "100%",
              }}
              fullWidth
              variant="contained"
            >
              Save
            </Button>
          </Grid>
          <Grid item xs={4}>
            <div className="stats">Stats</div>
            <Divider sx={{ my: 1, mb: 3 }} />
            <div className="stats-container">
              <div>
                <div className="stat-number">461</div>
                <div className="stat-label">Receipts</div>
              </div>
              <div>
                <div className="stat-number">32</div>
                <div className="stat-label">Text Replies</div>
              </div>

              <div>
                <div className="stat-number">16</div>
                <div className="stat-label">Phone Calls</div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AddCampaign;
