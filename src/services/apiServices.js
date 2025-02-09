import axios from '@/services/axiosInstance';

const token = import.meta.env.VITE_API_TOKEN;

const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + token
});

const apiServices = {
    getBranches: () => {
        return axios.get('branches?include[0]=sections&include[1]=sections.tables', { headers: headers });
    },
    updateAcceptReservation: (id, value) => {
        const raw = { 'accepts_reservations': value };
        return axios.put(`branches/${id}`, raw, {headers: headers});
    }
};

export default apiServices;