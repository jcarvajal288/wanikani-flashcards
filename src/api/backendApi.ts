import { JSONValue } from '../types.ts';
import axios from 'axios';

export const postSubjects = async (subjects: JSONValue) => {
    console.log('posting subjects to backend');
    await axios.post('http://localhost:3001/fillDatabase', subjects);
};
