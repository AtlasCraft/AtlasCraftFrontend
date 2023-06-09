/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios';
axios.defaults.withCredentials = true;
const api = axios.create({
  // baseURL: 'https://urchin-app-zt4cv.ondigitalocean.app/api',
  baseURL: 'https://jaszheng.me/api',
});

const api2 = axios.create({
  baseURL: 'https://ogre.adc4gis.com'
})
// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE CALL THE payload, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

// Map Editing info
export const createMapEditingInfo = (payload) => api.post('/mapeditinginfo', payload);
export const deleteMapEditingInfo = (id) => api.delete(`/mapeditinginfo/${id}`);
export const getMapEditingInfoById = (id) => api.get(`/mapeditinginfo/${id}`);
export const updateMapEditingInfoById = (id, payload) => api.post(`/mapeditinginfo/${id}`, payload);

// Map Card
export const getAllMapCards = ()=>api.get(`/mapcard`);
export const updateCardLikes = (id)=>api.post(`/mapcard/${id}/likes`);
export const updateCardDislikes = (id)=>api.post(`/mapcard/${id}/dislikes`);
export const updateComment = (id, payload) => api.post(`/updateComment/${id}`, payload);

// Auth
export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload);
export const loginUser = (payload) => api.post(`/login/`, payload);
export const logoutUser = () => api.get(`/logout/`);
export const getSecurityQuestions = (username) => api.get(`/sq/${username}`);
export const forgotPassword = (payload) => api.post('/forgotPassword', payload);
export const changePassword = (payload) => api.post('/changePassword', payload);

export const getComment = (payload) => api.post('/getComment', payload);

// ogre shp converter

export const convertToShp = (payload) =>api2.post('convertJson', payload);

const apis = {
  //map editing info
  createMapEditingInfo,
  deleteMapEditingInfo,
  getMapEditingInfoById,
  updateMapEditingInfoById,
  updateComment,
  //map cards
  getAllMapCards,
  updateCardDislikes,
  updateCardLikes,
  //auth
  getLoggedIn,
  registerUser,
  loginUser,
  logoutUser,
  getSecurityQuestions,
  forgotPassword,
  changePassword,
  getComment,

  convertToShp
};

export default apis;
