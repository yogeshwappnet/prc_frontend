import axios from "axios";

export default axios.create({
  baseURL: "http://projects.wappnet.us:3001/",
  headers: {
    "Content-type": "application/json"
  }
});
