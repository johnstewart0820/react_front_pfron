import axios from 'axios';
import authHeader from './auth-header';
import storage from '../utils/storage';
class Candidate {
    getInfo = () => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/candidate/info`, {
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
        .get(`${process.env.REACT_APP_BACKEND_URL}/candidate`, {
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
    create = (name, surname, person_id, date_of_birth, place_of_birth, street, house_number, apartment_number, post_code, post_office, city, stage, comment) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/candidate`, {
            name: name,
            surname: surname,
            person_id: person_id,
            date_of_birth: date_of_birth,
            place_of_birth: place_of_birth,
            street: street,
            house_number: house_number,
            apartment_number: apartment_number,
            post_code: post_code,
            post_office: post_office,
            city: city,
            stage: stage,
            comment: comment
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
    
    getListByOption = (sort_column, sort_order, count, page, searchId, searchName, searchSurname, searchQualificationPoint, searchStage, searchDateModified) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/candidate/getListByOption`, {
            sort_column: sort_column,
            sort_order: sort_order,
            count: count,
            page: page,
            searchId: searchId,
            searchName: searchName,
            searchSurname: searchSurname,
            searchQualificationPoint: searchQualificationPoint,
            searchStage: searchStage,
            searchDateModified: searchDateModified
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

    update = (name, surname, person_id, date_of_birth, place_of_birth, street, house_number, apartment_number, post_code, post_office, city, stage, comment, id) => {
        return axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/candidate`, {
            name: name,
            surname: surname,
            person_id: person_id,
            date_of_birth: date_of_birth,
            place_of_birth: place_of_birth,
            street: street,
            house_number: house_number,
            apartment_number: apartment_number,
            post_code: post_code,
            post_office: post_office,
            city: city,
            stage: stage,
            comment: comment,
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
        .delete(`${process.env.REACT_APP_BACKEND_URL}/candidate`, {
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
export default new Candidate();