import api from "../AxiosInterceptor";
import ICampaignData from "../types/Campaign";

const getCampaigns = () => {
  return api.get<ICampaignData>(`/campaign`);
};

const addCampaignMessage = (data) => {
  return api.post<any>("/campaign", data);
};

const getCampaign = (id) => {
  return api.get<any>(`campaign/${id}`)
}

const getFilters = () => {
  return api.get<any>(`/filter`);
}

const countReceipts = (data) => {
  return api.post<any>("/freshwork/filter", data);
}

const updateCampaign = (id, data) => {
  return api.put<any>(`/campaign/${id}`, data);
}

const CampaignService = {
  getCampaigns,
  addCampaignMessage,
  getCampaign,
  getFilters,
  countReceipts,
  updateCampaign
};

export default CampaignService;
