import {io} from 'socket.io-client';

// const URL = "http://localhost:4000" ;
const URL = import.meta.env.VITE_API_URL;

export const socket = io(URL , {
    autoConnect : true
})