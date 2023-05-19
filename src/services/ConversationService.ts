import api from "../AxiosInterceptor";

const getCampaignConversations = (id) => {
  return api.get<any>(`/conversation/campaign/${id}`);
};

const getConversationMessages = (id) => {
  return api.get<any>(`/message-log/conversation/${id}`);
};

const getContactDetails = (id) => {
  return api.get<any>(`/freshwork/contact/${id}`)
}

const getAccountDetails = (id) => {
  return api.get<any>(`/freshwork/account/${id}`)
}

const sendSMS = (body) =>{
  return api.post('/twilio/sms', body)
}

const ConversationService = {
  getCampaignConversations, getConversationMessages, getContactDetails,
   getAccountDetails, sendSMS
};

export default ConversationService;
