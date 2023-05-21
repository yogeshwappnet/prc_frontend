import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CampaignService from "../services/CampaignService";
import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import React from "react";
import StarIcon from "@mui/icons-material/Star";
import ConversationService from "../services/ConversationService";
import moment from "moment";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const Conversations: React.FC = () => {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = React.useState([]);
  const [conversations, setConversations] = React.useState([]);
  const [selectedCampaign, setSelectedCampaign] = React.useState({
    _id: "",
    name: "",
    status: "",
    receipts: "",
    replies: "",
  });

  const getCampaign = () => {
    CampaignService.getCampaigns().then((response: any) => {
      if (response.data?.data.length > 0) {
        response.data.data = response.data.data.map((data) => {
          data["id"] = data._id;
          return data;
        });
      }
      setCampaigns(response.data.data);
      setSelectedCampaign(response.data.data[0]);
    });
  };

  useEffect(() => {
    getConversations();
  }, [selectedCampaign]);

  const getConversations = () => {
    if (selectedCampaign._id != "") {
      ConversationService.getCampaignConversations(selectedCampaign._id).then(
        (res) => {
          setConversations(res.data?.data);
        }
      );
    }
  };

  const goToConversation = (id) => {
    navigate(`/dashboard/conversation/${id}`);
  };

  useEffect(() => {
    getCampaign();
  }, []);

  return (
      <Box sx={{ display: "flex" }}>
        <List sx={{ mr: 2, minWidth: "250px" }}>
          {campaigns.map((campaign, key) => {
            if (campaign._id === selectedCampaign?._id) {
              return (
                <ListItem key={campaign._id}>
                  <ListItemButton>
                    <ListItemIcon>
                      <StarIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={campaign.name} />
                  </ListItemButton>
                </ListItem>
              );
            } else {
              return (
                <ListItem key={campaign._id}>
                  <ListItemButton
                    onClick={() => {
                      setSelectedCampaign(campaign);
                    }}
                  >
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary={campaign.name} />
                  </ListItemButton>
                </ListItem>
              );
            }
          })}
        </List>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "auto",
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {conversations.length > 0 ? (
                <Grid item xs={12}>
                  {conversations.map((conversation, key) => {
                    return (
                      <Paper
                        key={key}
                        sx={{
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                          marginBottom: "10px",
                          padding: "10px 16px",
                        }}
                      >
                        <Grid
                          onClick={() => goToConversation(conversation._id)}
                          container
                          spacing={3}
                          sx={{ alignItems: "center", textAlign: "center" }}
                        >
                          {/* <div className="d-flex gap-2 align-items-center"> */}
                          <Grid item xs={1}>
                            <div className="button-avatar">
                              {conversation.contact?.sales_accounts[0]?.name[0]}
                            </div>
                          </Grid>
                          <Grid item xs={2}>
                            {conversation.contact?.sales_accounts[0]?.name}
                          </Grid>
                          <Grid item xs={3}>
                            <div className="d-flex align-items-center">
                              {conversation.last_message[0]?.isOutgoing ? (
                                <div style={{ marginRight: "10px" }}>
                                  <ArrowOutwardIcon />
                                </div>
                              ) : (
                                '"'
                              )}
                              <div className="text-ellipsis">
                                {conversation.last_message?.[0]?.messageText}
                              </div>
                              {!conversation.last_message?.[0]?.isOutgoing
                                ? '"'
                                : ""}
                            </div>
                          </Grid>
                          <Grid item xs={2}>
                            <div>
                              {conversation.contact?.first_name}{" "}
                              {conversation.contact?.last_name}
                            </div>
                          </Grid>
                          <Grid item xs={1}>
                            <div className="button-avatar">
                              {conversation.contact?.first_name[0]}
                              {conversation.contact?.last_name[0]}
                            </div>
                          </Grid>
                          <Grid item xs={3}>
                            <div className="d-flex gap-2">
                              {moment(
                                conversation.last_message?.[0]?.sentDateTime
                              ).format("DD MMM  h:mm a")}
                              <DoneAllIcon />
                            </div>
                          </Grid>
                          {/* </div> */}
                        </Grid>
                      </Paper>
                    );
                  })}
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <div>No Conversation found for this campaign.</div>
                </Grid>
              )}
            </Grid>
          </Container>
        </Box>
      </Box>
  );
};

export default Conversations;
