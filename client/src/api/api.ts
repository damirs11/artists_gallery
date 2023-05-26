import axios from "axios";

const api = '/api'
// const api = 'http://192.168.0.2:5000/api'

type GroupPosts = {
    count: number,
    items: any[]
}


export const getGroupInfo = async (id: string) => {
    try {
        const response = await axios.get(`${api}/getGroupInfo`, {params: {id: id}});
        return response.data;
    } catch (e) {
        throw new Error(`ERROR getGroupInfo: ${e}`)
    }
}


export const getGroupPosts = async (id: string): Promise<GroupPosts> => {
    // return temp as GroupPosts;

    try {
        const response = await axios.get(`${api}/getGroupPosts`, {params: {id: id}});
        return response.data;
    } catch (e) {
        throw new Error(`ERROR getGroupInfo: ${e}`)
    }
}

export const getExcelData = async () => {
    try {
        const response = await axios.get(`${api}/getExcelData`);
        return response.data;
    } catch (e) {
        throw new Error(`ERROR getExcelData: ${e}`)
    }
}