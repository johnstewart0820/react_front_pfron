import axios from 'axios';
import authHeader from './auth-header';
import storage from '../utils/storage';
class User {
    getProfile = () => {
        return axios
            .get(`${process.env.REACT_APP_BACKEND_URL}/user/profile`, {
                headers: authHeader(storage.getStorage('token'))
            })
            .then(response => {
                if (response.data.code === 401)
                    storage.removeStorage('token');
                return response.data;
            }).catch(error => {
                return error;
            })
    };
    changePassword = (old_password, new_password) => {
        return axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/user/change_password`, {
                old_password: old_password,
                new_password: new_password
            }, {
                headers: authHeader(storage.getStorage('token'))
            })
            .then(response => {
                if (response.data.code === 401)
                    storage.removeStorage('token');
                return response.data;
            })
            .catch(error => {
                return error;
            })
    }
}
export default new User();