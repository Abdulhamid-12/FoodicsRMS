import axios from "@/services/axiosInstance";

const token = import.meta.env.VITE_API_TOKEN;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: "Bearer " + token,
};

const apiServices = {
  getBranches: () => {
    return axios.get(
      "branches?include[0]=sections&include[1]=sections.tables",
      { headers: headers }
    );
  },
  updateBranch: (id, raw) => {
    return axios.put(`branches/${id}`, raw, { headers: headers });
  },
};

export default apiServices;
