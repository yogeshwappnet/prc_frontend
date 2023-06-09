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
import Select from "react-select";

const Conversations: React.FC = () => {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = React.useState([]);
  const [campaignNameList, setCampaignNameList] = React.useState([]);
  const [conversations, setConversations] = React.useState([]);
  const [selectedCampaign, setSelectedCampaign] = React.useState({
    _id: "",
    name: "",
    status: "",
    receipts: "",
    replies: "",
  });

  const [campaignSearch, setCampaignSearch] = React.useState([]);

  const getCampaign = () => {
    CampaignService.getCampaigns().then((response: any) => {
      let tempCampaignNameList = [];
      if (response.data?.data.length > 0) {
        response.data.data = response.data.data.map((data) => {
          data["id"] = data._id;
          tempCampaignNameList.push({
            value: data._id,
            label: data.name,
            ...data,
          });
          return data;
        });

        setCampaignNameList(tempCampaignNameList);
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

  const handleCampaignSearch = (event) => {
    setCampaignSearch(event);
    if (event.length > 0) {
      setSelectedCampaign(event[0]);
    }
  };

  return (
    <div className="height-170">
      <Box sx={{ display: "flex" }}>
        <div>
          <Select
            isMulti
            name="campaigns"
            options={campaignNameList}
            onChange={(event) => handleCampaignSearch(event)}
            className="basic-multi-select mr-15"
            classNamePrefix="select"
          />
          {campaignSearch.length > 0 ? (
            <List sx={{ mr: 2, minWidth: "250px", paddingLeft: 0 }}>
              {campaignSearch.map((campaign, key) => {
                if (campaign._id === selectedCampaign?._id) {
                  return (
                    <ListItem key={campaign._id} sx={{ paddingLeft: 0 }}>
                      <ListItemButton sx={{ paddingLeft: 0 }}>
                        <ListItemIcon>
                          <StarIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={campaign.name} />
                      </ListItemButton>
                    </ListItem>
                  );
                } else {
                  return (
                    <ListItem key={campaign._id} sx={{ paddingLeft: 0 }}>
                      <ListItemButton
                        sx={{ paddingLeft: 0 }}
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
          ) : (
            <List sx={{ mr: 2, minWidth: "250px", paddingLeft: 0 }}>
              {campaigns.map((campaign, key) => {
                if (campaign._id === selectedCampaign?._id) {
                  return (
                    <ListItem key={campaign._id} sx={{ paddingLeft: 0 }}>
                      <ListItemButton sx={{ paddingLeft: 0 }}>
                        <ListItemIcon>
                          <StarIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={campaign.name} />
                      </ListItemButton>
                    </ListItem>
                  );
                } else {
                  return (
                    <ListItem key={campaign._id} sx={{ paddingLeft: 0 }}>
                      <ListItemButton
                        sx={{ paddingLeft: 0 }}
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
          )}
        </div>

        <div className="height-170" style={{ flexGrow: 1}}>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "inherit",
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
                                {
                                  conversation.contact?.sales_accounts[0]
                                    ?.name[0]
                                }
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
        </div>
      </Box>
    </div>
  );
};

export default Conversations;
