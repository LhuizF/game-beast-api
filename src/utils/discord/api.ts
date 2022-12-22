import axios from 'axios';

class DiscordApi {
  request(url: string, data: any, method: string) {
    const baseURL = 'https://discord.com/api';

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bot ' + process.env.DISCORD_TOKEN
    };

    return axios({
      baseURL,
      url,
      method,
      headers,
      data
    });
  }

  async post(url: string, data: any) {
    return this.request(url, data, 'post');
  }
}

export const discordApi = new DiscordApi();
