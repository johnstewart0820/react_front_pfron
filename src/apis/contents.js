import axios from 'axios';
import authHeader from './auth-header';
import storage from '../utils/storage';
class Contents {
    getAllBlocks = () => {
        return axios
            .get(`${process.env.REACT_APP_BACKEND_URL}/block`)
            .then(response => {
                return response.data;
            }).catch(error => {
                return error;
            })
    }
    getBlocks = () => {
        return axios
            .get(`${process.env.REACT_APP_BACKEND_URL}/admin/contents`, {
                headers: authHeader(storage.getStorage('token'))
            })
            .then(response => {
                if (response.data.code === 401)
                    storage.removeStorage('token');
                return response.data;
            }).catch(error => {
                return error;
            })
    }

    getBlock = (id) => {
        return axios
            .get(`${process.env.REACT_APP_BACKEND_URL}/admin/content/${id}`, {
                headers: authHeader(storage.getStorage('token'))
            })
            .then(response => {
                if (response.data.code === 401)
                    storage.removeStorage('token');
                return response.data;
            }).catch(error => {
                return error;
            })
    }

    updateBlock = (id, content) => {
        return axios
            .put(`${process.env.REACT_APP_BACKEND_URL}/admin/content/${id}`, {
                content: content
            }, {
                headers: authHeader(storage.getStorage('token'))
            })
            .then(response => {
                if (response.data.code === 401)
                    storage.removeStorage('token');
                return response.data;
            }).catch(error => {
                return error;
            })
    }
}
export default new Contents();