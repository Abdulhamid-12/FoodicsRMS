import axios from '@/services/axiosConfig';

const apiServices = {
    getBranches: () => {
        return axios.get('branches?include[0]=sections&include[1]=sections.tables');
    }
};

export default apiServices;