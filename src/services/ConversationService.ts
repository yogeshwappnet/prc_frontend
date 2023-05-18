import api from "../AxiosInterceptor";

const getCampaignConversations = (id) => {
  return api.get<any>(`/conversation/campaign/${id}`);
};

const ConversationService = {
  getCampaignConversations
};

export default ConversationService;
