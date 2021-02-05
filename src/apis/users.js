import axios from 'axios';
import authHeader from './auth-header';
import storage from '../utils/storage';
class Users {
    getInfo = () => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/users/info`, {
            headers: authHeader(storage.getStorage('token')),
        })
        .then(response => {
            if (response.data.code === 401) {
                storage.removeStorage('token');
                storage.removeStorage('role');
                return response.data;
            } else if (response.data.code === 200) {
                return response.data;
            }
        }).catch(error => {
            return error;
        })
    }
    get = (id) => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/users`, {
            headers: authHeader(storage.getStorage('token')),
            params: {
                id: id
            },
        })
        .then(response => {
            if (response.data.code === 401) {
                storage.removeStorage('token');
                storage.removeStorage('role');
                return response.data;
            } else if (response.data.code === 200) {
                return response.data;
            }
        }).catch(error => {
            return error;
        })
    }

    getProfile = () => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/users/getProfile`, {
            headers: authHeader(storage.getStorage('token')),
        })
        .then(response => {
            if (response.data.code === 401) {
                storage.removeStorage('token');
                storage.removeStorage('role');
                return response.data;
            } else if (response.data.code === 200) {
                return response.data;
            }
        }).catch(error => {
            return error;
        })
    }

    updateProfile = (name, email, id_role, activate_status, password, newPassword) => {
        return axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/users/updateProfile`, {
            name: name,
            email: email,
            id_role: id_role,
            activate_status: activate_status,
            password: password,
            newPassword: newPassword
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

    create = (name, email, id_role, activate_status) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/users`, {
            name: name,
            email: email,
            id_role: id_role,
            activate_status: activate_status
        }, {
            headers: authHeader(storage.getStorage('token'))
        }).then(response => {
            if (response.data.code === 401)
                storage.removeStorage('token');
            return response.data;
        }).catch(error => {
            return error;
        })
    }
    
    getListByOption = (sort_column, sort_order, count, page, searchId, searchName, searchRole, searchEmail, searchActivateStatus) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/users/getListByOption`, {
            sort_column: sort_column,
            sort_order: sort_order,
            count: count,
            page: page,
            searchId: searchId,
            searchName: searchName,
            searchRole: searchRole,
            searchEmail: searchEmail,
            searchActivateStatus: searchActivateStatus
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

    update = (name, email, id_role, activate_status, id) => {
        return axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/users`, {
            name: name,
            email: email,
            id_role: id_role,
            activate_status: activate_status,
            id: id
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

    delete = (id) => {
        return axios
        .delete(`${process.env.REACT_APP_BACKEND_URL}/users`, {
            headers: authHeader(storage.getStorage('token')),
            params: {
                id: id
            }, 
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
export default new Users();