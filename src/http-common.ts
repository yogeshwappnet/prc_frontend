import axios from "axios";

export default axios.create({
  baseURL: "https://projects.wappnet.us:3001/",
  headers: {
    "Content-type": "application/json"
  }
});
