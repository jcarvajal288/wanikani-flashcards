import { JSONValue } from '../types.ts';
import axios from 'axios';

export const postSubjects = async (subjects: JSONValue) => {
    await axios.post('http://localhost:3001/fillDatabase', subjects);
};

export const loadSubjects = async (subjects: number[]): Promise<JSONValue[]> => {
    return await axios
        .get(`http://localhost:3001/loadFromDatabase?subject_ids=${subjects.join(',')}`)
        .then((response) => response.data);
};
