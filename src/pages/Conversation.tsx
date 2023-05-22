import { Box, Divider, Fab, Grid, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import WifiCalling3Icon from "@mui/icons-material/WifiCalling3";
import SendIcon from "@mui/icons-material/Send";
import ConversationService from "../services/ConversationService";
import CampaignService from "../services/CampaignService";
import moment from "moment";
import { toast } from "react-toastify";

const Conversation: React.FC = () => {
  const { id } = useParams();

  const [messages, setMessages] = React.useState([]);

  const [campaign, setCampaign] = React.useState({
    name: "",
    _id: "",
  });

  const [contact, setContact] = React.useState({
    id: "",
  });

  const [account, setAccount] = React.useState({
    name: " ",
    phone: " ",
  });

  const [groupedMessages, setGroupedMessages] = React.useState({});

  const getConversationDetails = (isGetData = false) => {
    ConversationService.getConversationMessages(id).then((res) => {
      res.data.data = res.data.data.map((message) => {
        const sentDate = moment(message.sentDateTime).startOf("day");
        const today = moment().startOf("day");
        const yesterday = moment().subtract(1, "day").startOf("day");

        if (sentDate.isSame(today, "day")) {
          message["date"] = "Today";
        } else if (sentDate.isSame(yesterday, "day")) {
          message["date"] = "Yesterday";
        } else {
          message["date"] = sentDate.format("DD-MMM-YY");
        }
        return message;
      });

      let newGroupedMessages = [];

      for (let index = 0; index < res.data.data.length; index++) {
        const element = res.data.data[index];

        if (newGroupedMessages[element.date]?.length > 0) {
          newGroupedMessages[element.date].push(element);
        } else {
          newGroupedMessages[element.date] = [];
          newGroupedMessages[element.date].push(element);
        }
      }

      setGroupedMessages(newGroupedMessages);

      setMessages(res.data.data);
      if (isGetData) {
        getCampaignDetails(res.data.data[0]?.campaignId);
        getContactDetails(res.data.data[0]?.contactId);
      }
    });
  };

  const getCampaignDetails = (id) => {
    CampaignService.getCampaign(id).then((res) => {
      setCampaign(res.data.data.campaign);
    });
  };

  const getContactDetails = (id) => {
    ConversationService.getContactDetails(id).then((res) => {
      setContact(res.data.data.contact);
      getAccountDetails(res.data.data.contact.sales_accounts[0].id);
    });
  };

  const getAccountDetails = (id) => {
    ConversationService.getAccountDetails(id).then((res) => {
      setAccount(res.data.data.account);
    });
  };

  const sendMessage = () => {
    let messageText = (
      document.getElementById("textMessage") as HTMLInputElement
    ).value;
    if (messageText === "") {
      toast.error("Message cannot be empty.");
      return;
    } else {
      ConversationService.sendSMS({
        campaignId: campaign._id,
        conversationId: id,
        contactId: contact.id,
        messageText: messageText,
        to: messages[0].to,
      }).then((res) => {
        getConversationDetails(false);
        (document.getElementById("textMessage") as HTMLInputElement).value = "";
      });
    }
  };

  useEffect(() => {
    getConversationDetails(true);
  }, [id]);

  return (
    <Box sx={{ display: "flex" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div className="d-flex align-items-center gap-4">
            <div className="button-avatar">{account.name[0]}</div>
            <div>
              <div className="font-14">{account.name}</div>
              <div className="font-12">Other: {account.phone ?? "-"}</div>
              <div className="campaignName">{campaign.name}</div>
            </div>
          </div>
          <Divider sx={{ mt: 3 }} />
        </Grid>
        <Grid item xs={12} className="calc-height">
          {Object.entries(groupedMessages).map(([date, messages], index) => (
            <React.Fragment key={index}>
              <Divider>
                <div className="chip">
                  {date === "Today"
                    ? "Today"
                    : date === "Yesterday"
                    ? "Yesterday"
                    : moment(date, "DD-MMM-YY").format("DD-MMM-YY")}
                </div>
              </Divider>
              {(messages as Array<any>).map((message, key) => (
                <div key={key}>
                  <div className="d-flex align-items-center gap-4 mt-2">
                    <div className="button-avatar black">
                      {message?.isOutgoing ? campaign.name[0] : account.name[0]}
                    </div>
                    <div className="w-70">
                      <div className="c-name d-flex align-items-center gap-4">
                        {message?.isOutgoing ? campaign.name : account.name}
                        <div className="time-name">
                          {moment(message?.sentDateTime).format("h:mm a")}
                        </div>
                      </div>
                      <div className="w-70">
                        <div className="c-name d-flex align-items-center gap-4">
                          {message?.isOutgoing ? campaign.name : account.name}
                          <div className="time-name">{moment(message?.sentDateTime).format("h:mm a")}</div>
                        </div>
                      </div>
                      {message?.status === "Call Received" ? (
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
                      ) : (
                        <div className="mt-2">{message?.messageText}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
          </Grid>
        <Grid item xs={12}>
          <div className="d-flex align-items-center">
            <TextField
              sx={{ width: "100%", mb: 2 }}
              multiline
              rows={4}
              id="textMessage"
            ></TextField>
            <Fab color="primary" sx={{ ml: 2 }} onClick={sendMessage}>
              <SendIcon />
            </Fab>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Conversation;
