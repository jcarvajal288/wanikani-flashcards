import { JSONValue, WaniKaniSubject } from '../types.ts';
import axios from 'axios';

const baseUrl = 'http://localhost:3001'

export const postSubjects = async (subjects: JSONValue) => {
    await axios.post(`${baseUrl}/fillDatabase`, subjects);
};

export const loadSubjects = async (subjects: number[]): Promise<WaniKaniSubject[]> => {
    return await axios
        .get(`${baseUrl}/loadFromDatabase?subject_ids=${subjects.join(',')}`)
        .then((response) => response.data);
};

export const deleteAllSubjects = async (): Promise<void> => {
    await axios.post(`${baseUrl}/dropDatabase`);
}
