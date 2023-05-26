import axios from "axios";

const api = '/api'
// const api = 'http://192.168.0.2:5000/api'

type GroupPosts = {
    count: number,
    items: any[]
}

const storageGetGroupInfo = new Map<string, any>();
const storageGetGroupPosts = new Map<string, any>();

export const getGroupInfo = async (id: string) => {
    try {
        const response = await axios.get(`${api}/getGroupInfo`, {params: {id: id}});

        if (storageGetGroupInfo.has(id)) {
            return storageGetGroupInfo.get(id);
        } else {
            storageGetGroupInfo.set(id, response.data);
        }

        return response.data;
    } catch (e) {
        throw new Error(`ERROR getGroupInfo: ${e}`)
    }
}


export const getGroupPosts = async (id: string): Promise<GroupPosts> => {
    // return temp as GroupPosts;

    try {
        const response = await axios.get(`${api}/getGroupPosts`, {params: {id: id}});

        if (storageGetGroupPosts.has(id)) {
            return storageGetGroupPosts.get(id);
        } else {
            storageGetGroupPosts.set(id, response.data);
        }

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