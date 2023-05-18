import React, { useEffect, useState } from "react";
import { Box, Button, Divider, FormControl, Grid, Switch, TextField, Typography } from "@mui/material";
import useNotification from "../hooks/useNotification";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CampaignService from "../services/CampaignService";

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
  const [campaignMessages, setCampaignMessages] = useState<
    Array<{
      messageNumber: string;
      messageText: string;
      delay: string;
    }>
  >([]);

  const handleAddMessage = () => {
    setCampaignMessages([
      ...campaignMessages,
      {
        messageNumber: (campaignMessages.length + 1).toString(),
        messageText: "",
        delay: "0 Day"
      }
    ]);
  };

  const { id } = useParams();

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    campaignName: Yup.string()
      .required("Name is required")
      .matches(/^[a-zA-Z]+$/, "Campaign name must contain only alphabets"),

    timeOfDay: Yup.string().required("Time of the day is required"),
    campaignMessage: Yup.string().required("Campaign message is required")
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<AddCampaignForm>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data: AddCampaignForm) => {
    const payload: any = {
      name: data.campaignName,
      status: data.status,
      forwardIncomingCall: data.forwardIncomingCall,
      forwardIncomingCallNumber: data.forwardIncomingCallNumber,
      receipts: data.receipts,
      filter: [
        {
          attribute: "owner_id",
          operator: "is_in",
          value: ["17000096272"],
          tableName: "sales_account"
        },
        {
          attribute: "cf_has_local_owner",
          operator: "is_in",
          value: ["Yes"],
          tableName: "sales_account"
        },
        {
          attribute: "owner_id",
          operator: "is_in",
          value: ["17000089212"],
          tableName: "contact"
        }
      ],
      timeOfDay: data.timeOfDay,
      messages: campaignMessages.map((message) => ({
        messageNumber: message.messageNumber,
        messageText: message.messageText,
        delay: message.delay
      }))
    };
    CampaignService.addCampaignMessage(payload).then(
      (response: any) => {
        reset();
        console.log(">>>>>>>>>>", response);
        navigate("/");
      }
    );
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid spacing={12} sx={{ mb: 4, alignItems: "center", justifyContent: "space-between" }}>
          <Grid item xs={5}>
            <TextField
              error={errors.campaignName ? true : false}
              sx={{ width: "100%" }}
              id="filled-multiline-static"
              label="Campaign Name"
              {...register("campaignName")}
              type="text"
              // required
              helperText={errors.campaignName?.message}
            />
          </Grid>
          <Grid item xs={4}>
            <label> Status: </label> <Switch inputProps={{ "aria-label": "controlled" }} /> <label> Active</label>
          </Grid>
        </Grid>
        <Divider sx={{ my: 1, mb: 3 }} />
        <Grid
          container
          spacing={12}
          sx={{
            mb: 3,
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Grid item xs={4}>
            <Button type="submit" fullWidth variant="contained">
              Edit Filters
            </Button>
          </Grid>
          <Grid item xs={4}>
            <TextField
              error={errors.timeOfDay ? true : false}
              type="time"
              sx={{ width: "100%" }}
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
            justifyContent: "space-between"
          }}
        >
          <Grid item xs={7}>
            {campaignMessages.map((message, index) => (
              <div key={index}>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Message {message.messageNumber}
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <TextField
                      sx={{ width: "100%", mb: 2 }}
                      label={`Message Text ${message.messageNumber}`}
                      error={Boolean(errors.messages?.[index]?.messageText)}
                      helperText={errors.messages?.[index]?.messageText?.message}
                      multiline
                      rows={4}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <div className="interval">
                      Interval:
                      <TextField
                        sx={{ width: "8%", ml: 2, mr: 2 }}
                        label={`Delay for Message ${message.messageNumber}`}
                        variant="outlined"
                        error={Boolean(errors.messages?.[index]?.delay)}
                        helperText={errors.messages?.[index]?.delay?.message}
                      />
                      days after first message.
                    </div>
                  </Grid>
                </Grid>
              </div>
            ))}
            <Button
              onClick={handleAddMessage}
              sx={{
                mt: 2
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
                width: "100%"
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
