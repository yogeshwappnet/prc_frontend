import { Box, Divider, Fab, Grid, TextField } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import WifiCalling3Icon from "@mui/icons-material/WifiCalling3";
import SendIcon from "@mui/icons-material/Send";

const Conversation: React.FC = () => {
  const { id } = useParams();

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className="d-flex align-items-center gap-4">
              <div className="button-avatar">SH</div>
              <div>
                <div className="font-14">Secure Storage of Heaven</div>
                <div className="font-12">Other: (469) 446-1221</div>
                <div className="campaignName">Campaign Name</div>
              </div>
            </div>
            <Divider sx={{ mt: 3 }} />
          </Grid>
          <Grid item xs={12} className="calc-height">
            <Divider>
              <div className="chip">Today</div>
            </Divider>
            <div className="d-flex align-items-center gap-4 mt-2">
              <div className="button-avatar black">SH</div>
              <div className="w-70">
                <div className="c-name d-flex align-items-center gap-4">
                  Campaign Name
                  <div className="time-name">11:37 am</div>
                </div>
                <div className="mt-2">
                  Mark, My Name is Eric, We own storage facilities across the
                  country, and are looking to expand into Okla. Mark, My Name is
                  Eric, We own storage facilities across the country, and are
                  looking to expand into Okla
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-4 mt-2">
              <div className="button-avatar">SH</div>
              <div className="w-70">
                <div className="c-name d-flex align-items-center gap-4">
                  Secure Storage of Heaven
                  <div className="time-name">11:37 am</div>
                </div>
                <div className="mt-2">Hi Eric, I will call you soon</div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-4 mt-2">
              <div className="button-avatar">SH</div>
              <div className="w-70">
                <div className="c-name d-flex align-items-center gap-4">
                  Secure Storage of Heaven
                  <div className="time-name">11:37 am</div>
                </div>
                <div className="mt-2 call">
                  <div className="incoming-call">
                    <WifiCalling3Icon
                      sx={{ fontSize: "14px", marginRight: "10px" }}
                    />
                    Incoming Call
                  </div>
                  <Divider />
                  <div className="trnsfr-to">
                    {" "}
                    Transferred To (832)-864-4938
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="d-flex align-items-center">
              <TextField
                sx={{ width: "100%", mb: 2 }}
                multiline
                rows={4}
              ></TextField>
              <Fab color="primary" sx={{ml: 2}}>
                <SendIcon />
              </Fab>
            </div>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Conversation;
