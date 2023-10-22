import { JSONValue } from '../types.ts';
import axios from 'axios';

export const postSubjects = async (subjects: JSONValue) => {
    await axios.post('http://localhost:3001/fillDatabase', subjects);
};
