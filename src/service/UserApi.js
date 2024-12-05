import axiosClients from "../AxiosClient";
const HttpService = {
    updateUser: (data) => {
        const url = `/user`;
        return axiosClients.put(url,data);
    },

};

export default HttpService;
