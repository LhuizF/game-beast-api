import axios from 'axios';

export const discordApi = axios.create({
  baseURL: 'https://discord.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});
