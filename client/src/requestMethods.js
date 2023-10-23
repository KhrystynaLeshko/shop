import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MWJmYzE0YmEwNDNhODRlMWUwNGVhOCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY5NzExMDU4MiwiZXhwIjoxNjk3MzY5NzgyfQ.6T5YLSN_8c0kQD5QynhqZ1DCXT1oKvYyoYPlzU9mLoU";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  header: { token: `Bearer ${TOKEN}` },
});