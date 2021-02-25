import axios from 'axios';
import authHeader from './auth-header';
import storage from '../utils/storage';
class Participant {
    getInfo = () => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/participant/info`, {
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
        .get(`${process.env.REACT_APP_BACKEND_URL}/participant`, {
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
    
    getListByOption = (sort_column, sort_order, count, page, searchId, searchName, searchSurname, searchRehabitationCenter, searchParticipantStatusType, searchDateModified) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/participant/getListByOption`, {
            sort_column: sort_column,
            sort_order: sort_order,
            count: count,
            page: page,
            searchId: searchId,
            searchName: searchName,
            searchSurname: searchSurname,
            searchRehabitationCenter: searchRehabitationCenter,
            searchParticipantStatusType: searchParticipantStatusType,
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

    update = (name, surname, person_id, date_of_birth, place_of_birth, street, house_number, apartment_number, post_code, post_office, city, 
        second_street, second_house_number, second_apartment_number, second_post_code, second_post_office, second_city,
        voivodeship, community, county, mobile_phone, home_phone, email, family_home_phone, family_mobile_phone,
        education, academic_title, stay_status, children_applicable, children_amount, children_age,
        employed_status, employed_type, employed_in, occupation, unemployed_status,
        have_unemployed_person_status, unemployed_person_id, long_term_employed_status, seek_work_status,
        passive_person_status, full_time_status, evening_student_status, disabled_person_status,
        number_certificate, date_of_certificate, level_certificate, code_certificate, necessary_certificate,
        ethnic_minority_status, homeless_person_status, stay_house_status, house_hold_status, house_hold_adult_status, uncomfortable_status,
        comment, participant_status_type, id) => {
        return axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/participant`, {
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
            second_street: second_street,
            second_house_number: second_house_number,
            second_apartment_number: second_apartment_number,
            second_post_code: second_post_code,
            second_post_office: second_post_office,
            second_city: second_city,
            voivodeship: voivodeship,
            community: community,
            county: county,
            mobile_phone: mobile_phone,
            home_phone: home_phone,
            email: email,
            family_home_phone: family_home_phone,
            family_mobile_phone: family_mobile_phone,
            education: education,
            academic_title: academic_title,
            stay_status: stay_status,
            children_applicable: children_applicable,
            children_amount: children_amount,
            children_age: children_age,
            employed_status: employed_status,
            employed_type: employed_type,
            employed_in: employed_in,
            occupation: occupation,
            unemployed_status: unemployed_status,
            have_unemployed_person_status: have_unemployed_person_status,
            unemployed_person_id: unemployed_person_id,
            long_term_employed_status: long_term_employed_status,
            seek_work_status: seek_work_status,
            passive_person_status: passive_person_status,
            full_time_status: full_time_status,
            evening_student_status: evening_student_status,
            disabled_person_status: disabled_person_status,
            number_certificate: number_certificate,
            date_of_certificate: date_of_certificate,
            level_certificate: level_certificate,
            code_certificate: code_certificate,
            necessary_certificate: necessary_certificate,
            ethnic_minority_status: ethnic_minority_status,
            homeless_person_status: homeless_person_status,
            stay_house_status: stay_house_status,
            house_hold_status: house_hold_status,
            house_hold_adult_status: house_hold_adult_status,
            uncomfortable_status: uncomfortable_status,
            comment: comment,
			participant_status_type: participant_status_type,
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
}
export default new Participant();