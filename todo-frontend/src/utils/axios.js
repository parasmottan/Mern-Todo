import axios from 'axios';


const instance = axios.create({
  baseURL: 'https://mern-todo-frontend-seven-ochre.vercel.app/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }




})



export default instance;
