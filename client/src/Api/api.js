import axios from 'axios'

const api = axios.create({
    baseURL: 'https://busyness-344108.uw.r.appspot.com'
    //baseURL: 'http://localhost:8000'
})

export const getAllBuildings = () => api.get(`/api/get_all_buildings`)
export const getBuildingById = id => api.get(`/api/get_building/?id=${id}`)
export const getPastBusynessOfRoom = roomid => api.get(`/api/get_past_busyness_of_room/?roomid=${roomid}`)
export const getAllRoomsInAllBuildings = () => api.get(`/api/get_all_rooms_in_all_buildings`)

const apis = {
    getAllBuildings,
    getBuildingById,
    getPastBusynessOfRoom,
    getAllRoomsInAllBuildings
}

export default apis;
export {api};