import axios from 'axios';

export const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers:{
        'Accept': 'application/json',
        'Content-Type' : 'application/json'
    },
    withCredentials: true
})

export const httpMultFormData = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers:{
        'Content-Type': 'multipart/form-data',
        'Accept': 'multipart/form-data',
    },
    withCredentials: true
})