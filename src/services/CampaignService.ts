import api from "../AxiosInterceptor";
import ICampaignData from "../types/Campaign";

const getCampaign = () => {
  return api.get<ICampaignData>(`/campaign`);
};

const addCampaignMessage = (data) => {
  return api.post<any>("/campaign", data);
};

const CampaignService = {
  getCampaign,
  addCampaignMessage
};

export default CampaignService;
