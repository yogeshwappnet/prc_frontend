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
import * as Yup from "yup";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CampaignService from "../services/CampaignService";
import EditFilterPopover from "../partials/EditFilterPopover";
import { toast } from "react-toastify";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type AddCampaignForm = {
  campaignName: string;
  status: string;
  forwardIncomingCall: boolean;
  forwardIncomingCallNumber: string;
  receipts: string;
  timeOfDay: string;
  messages: string;
};

const AddCampaign: React.FC = () => {
  const [campaignMessages, setCampaignMessages] = useState([
    {
      messageNumber: "1",
      messageText: "",
      delay: 0,
      isMessageError: false,
      isDelayError: false,
      _id: "",
    },
  ]);

  const [tempMessages, setTempMessaeges]= useState([]);

  const [filteredCount, setFilteredCount] = useState(0);

  const [error, setError] = useState(false);

  const handleAddMessage = () => {
    setCampaignMessages([
      ...campaignMessages,
      {
        messageNumber: (campaignMessages.length + 1).toString(),
        messageText: "",
        delay: 0,
        isMessageError: false,
        isDelayError: false,
        _id: "",
      },
    ]);
  };

  const { id } = useParams();
  let allFilter = [];
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    campaignName: Yup.string()
      .required("Name is required")
      .matches(/^[a-zA-Z]+$/, "Campaign name must contain only alphabets"),
    forwardIncomingCallNumber: Yup.string().required(
      "Phone number is required"
    ),
    timeOfDay: Yup.string().required("Time of the day is required"),
    status: Yup.string(),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddCampaignForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: AddCampaignForm) => {
    if (!error) {
      let messages = [];

      campaignMessages.forEach((msg) => {
        if (id) {
          messages.push({
            messageNumber: msg.messageNumber,
            messageText: msg.messageText,
            delay: msg.delay,
            _id: msg._id,
          });
        } else {
          messages.push({
            messageNumber: msg.messageNumber,
            messageText: msg.messageText,
            delay: msg.delay,
          });
        }
      });

      if (id) {
        let allTempMessages = JSON.parse(JSON.stringify(tempMessages));

        allTempMessages.forEach((tempMessage, key) => {
          let isDeleted = true;
          for (let index = 0; index < messages.length; index++) {
            const message = messages[index];
            if (message?._id == tempMessage._id) {
              isDeleted = false;
              break;
            }
          }
          if (isDeleted) {
            allTempMessages[key]["isDeleted"] = true;
          } else {
            allTempMessages[key]["isDeleted"] = false;
          }
        });
        // messages.forEach((message, key) => {
        //   let tempMessage = allTempMessages.filter((r) => {
        //     if (r._id == message._id) {
        //       return r;
        //     }
        //     message["isDeleted"] = tempMessage[0]["isDeleted"];
        //   });
        // });

        allTempMessages = allTempMessages.filter((r) => {
          if (r["isDeleted"]) {
            return r;
          }
        });
      messages.push(...allTempMessages);
      }

      let filters = [];

      if (popoverData.length > 0) {
        popoverData.forEach((filter) => {
          if (filter.selectedOperator && filter.selectedValue) {
            filters.push({
              attribute: filter.attribute,
              operator: filter.selectedOperator,
              value: [filter.selectedValue],
              tableName: filter.tableName,
            });
          }
        });
      }

      const payload: any = {
        name: data.campaignName,
        status: data.status == "true" ? "Active" : "Inactive",
        forwardIncomingCall: data.forwardIncomingCall,
        forwardIncomingCallNumber: data.forwardIncomingCallNumber,
        receipts: data.receipts,
        filter: filters,
        timeOfDay: data.timeOfDay,
        messages: messages,
      };

      if (id) {
        CampaignService.updateCampaign(id, payload).then((response: any) => {
          navigate("/");
        });
      } else {
        CampaignService.addCampaignMessage(payload).then((response: any) => {
          reset();
          console.log(">>>>>>>>>>", response);
          navigate("/");
        });
      }
    }
  };

  const updateMessageText = (event, index) => {
    let tempMessages = JSON.parse(JSON.stringify(campaignMessages));

    tempMessages[index].messageText = event.target.value;

    setCampaignMessages(tempMessages);
  };

  const updateMessageNumber = (event, index) => {
    let tempMessages = JSON.parse(JSON.stringify(campaignMessages));

    tempMessages[index].delay = event.target.value;

    setCampaignMessages(tempMessages);
  };

  const [popoverData, setPopoverData] = useState([]);

  const handlePopoverData = (data) => {
    setPopoverData(data);
  };

  const getAllFilters = () => {
    CampaignService.getFilters().then((res) => {
      res.data = res.data.map((filter) => {
        filter["selectedValue"] = "";
        filter["selectedOperator"] = "";
        return filter;
      });
      allFilter = res.data;
      getCampaign();
    });
  };

  const getCampaign = () => {
    CampaignService.getCampaign(id).then((res) => {
      setValue("campaignName", res.data.data.campaign.name);
      setValue(
        "status",
        res.data.data.campaign.status == "Active" ? "true" : "false"
      );
      setValue(
        "forwardIncomingCallNumber",
        res.data.data.campaign.forwardIncomingCallNumber
      );
      setValue("timeOfDay", res.data.data.campaign.timeOfDay);

      let messages = [];
      res.data.data.message.forEach((message) => {
        messages.push({
          messageNumber: message.messageNumber,
          messageText: message.messageText,
          delay: message.delay,
          isMessageError: false,
          isDelayError: false,
          _id: message._id,
        });
      });
      setTempMessaeges(messages);

      setCampaignMessages(messages);

      let filters = [];
      res.data.data.campaign.filter.forEach((filter) => {
        let tempFilter = allFilter.filter((ftr) => {
          if (ftr.attribute == filter.attribute) {
            return ftr;
          }
        });

        filters.push({
          attribute: filter.attribute,
          emptyValue: tempFilter[0].emptyValue,
          name: tempFilter[0].name,
          operator: tempFilter[0].operator,
          selectedOperator: filter.operator,
          selectedValue: filter.value[0],
          tableName: tempFilter[0].tableName,
          type: tempFilter[0].type,
          value: tempFilter[0].value,
          _id: tempFilter[0]._id,
        });
      });

      console.log(filters);
      setPopoverData(filters);
    });
  };

  useEffect(() => {
    countReceipts();
  }, [popoverData]);

  useEffect(() => {
    if (id) {
      getAllFilters();
    }
  }, [id]);

  const countReceipts = () => {
    let filters = [];

    if (popoverData.length > 0) {
      popoverData.forEach((filter) => {
        if (filter.selectedOperator && filter.selectedValue) {
          filters.push({
            attribute: filter.attribute,
            operator: filter.selectedOperator,
            value: [filter.selectedValue],
            tableName: filter.tableName,
          });
        }
      });
    }

    filters = [];
    filters.push({
      attribute: "name",
      operator: "contains_any",
      value: ["Kishan"],
      tableName: "sales_account",
    });

    if (filters.length > 0) {
      CampaignService.countReceipts({ filter_rule: filters }).then((res) => {
        setFilteredCount(res.data.data.contactsCount);
      });
    }
  };

  const validate = () => {
    let tempMessages = JSON.parse(JSON.stringify(campaignMessages));
    setError(false);
    tempMessages = tempMessages.map((message, key) => {
      message.isMessageError = false;
      message.isDelayError = false;

      if (key == 0) {
        if (message.messageText === "") {
          message.isMessageError = true;
          setError(true);
        }
      } else {
        if (message.messageText === "") {
          message.isMessageError = true;
          setError(true);
        }
        if (message.delay == "") {
          message.isDelayError = true;
          setError(true);
        }
      }

      return message;
    });
    let filters = [];
    if (popoverData.length > 0) {
      popoverData.forEach((filter) => {
        if (filter.selectedOperator && filter.selectedValue) {
          filters.push({
            attribute: filter.attribute,
            operator: filter.selectedOperator,
            value: [filter.selectedValue],
            tableName: filter.tableName,
          });
        }
      });
    }

    if (filters.length == 0) {
      setError(true);
      toast.error("Please add at least one filter");
    }

    setCampaignMessages(tempMessages);
  };

  const handleRemoveMessage = (i) => {
    let tempMessages = JSON.parse(JSON.stringify(campaignMessages));

    tempMessages = tempMessages.filter((msg, key) => {
      if (key != i) {
        return msg;
      }
    });

    setCampaignMessages(tempMessages);
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          spacing={12}
          sx={{
            display: "flex",
            mb: 4,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid item xs={5}>
            <TextField
              error={errors.campaignName ? true : false}
              sx={{ width: "100%" }}
              id="filled-multiline-static"
              InputLabelProps={{ shrink: true }}
              label="Campaign Name"
              {...register("campaignName")}
              type="text"
              helperText={errors.campaignName?.message}
            />
          </Grid>
          <Grid item xs={4}>
            <label> Status: </label>
            <Switch
              {...register("status")}
              inputProps={{ "aria-label": "controlled" }}
            />
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
            <EditFilterPopover
              filter={popoverData}
              onPopoverData={handlePopoverData}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              type="text"
              error={errors.forwardIncomingCallNumber ? true : false}
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
              id="filled-multiline-static"
              {...register("forwardIncomingCallNumber", { required: true })}
              label="Incoming call forward number"
              helperText={errors.forwardIncomingCallNumber?.message}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              error={errors.timeOfDay ? true : false}
              type="time"
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
              {...register("timeOfDay", { required: true })}
              id="filled-multiline-static"
              label="Time of the Day"
              helperText={errors.timeOfDay?.message}
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
            {campaignMessages.map((message, index) => (
              <div key={index}>
                <div className="d-flex justify-content-between align-items-center">
                  <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                    Message {index + 1}
                  </Typography>
                  {index == 0 ? (
                    <></>
                  ) : (
                    <DeleteOutlineIcon
                      onClick={() => handleRemoveMessage(index)}
                    />
                  )}
                </div>
                <Grid container spacing={2}>
                  {index != 0 ? (
                    <Grid item xs={12}>
                      <div className="interval">
                        Interval:
                        <TextField
                          sx={{ width: "8%", ml: 2, mr: 2 }}
                          label={`Delay for Message ${message.messageNumber}`}
                          variant="outlined"
                          value={message.delay}
                          onChange={(event) =>
                            updateMessageNumber(event, index)
                          }
                          error={Boolean(message.isDelayError)}
                          helperText={
                            Boolean(message.isDelayError)
                              ? "Please Enter Delay"
                              : ""
                          }
                        />
                        days after first message.
                      </div>
                    </Grid>
                  ) : (
                    ""
                  )}
                  <Grid item xs={12}>
                    <TextField
                      sx={{ width: "100%", mb: 2 }}
                      label={`Message Text ${message.messageNumber}`}
                      error={Boolean(message.isMessageError)}
                      value={message.messageText}
                      onChange={(event) => updateMessageText(event, index)}
                      helperText={
                        Boolean(message.isMessageError)
                          ? "Please Enter Message"
                          : ""
                      }
                      multiline
                      rows={4}
                    />
                  </Grid>
                </Grid>
              </div>
            ))}
            <Button
              onClick={handleAddMessage}
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
              onClick={validate}
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
                <div className="stat-number">{filteredCount}</div>
                <div className="stat-label">Receipts</div>
              </div>
              <div>
                <div className="stat-number">0</div>
                <div className="stat-label">Text Replies</div>
              </div>

              <div>
                <div className="stat-number">0</div>
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
