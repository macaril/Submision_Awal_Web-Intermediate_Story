import { getAccessToken } from '../utils/auth';

const BASE_URL = 'https://story-api.dicoding.dev/v1';

class StoryApi {
  static async register(name, email, password) {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      
      return await response.json();
    } catch (error) {
      return {
        error: true,
        message: error.message,
      };
    }
  }

  static async login(email, password) {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      
      const responseJson = await response.json();
      
      return {
        error: responseJson.error,
        message: responseJson.message,
        data: responseJson.loginResult || null,
        ok: !responseJson.error,
      };
    } catch (error) {
      return {
        error: true,
        message: error.message,
        data: null,
        ok: false,
      };
    }
  }

  static async getAllStories(page = 1, size = 10, includeLocation = 1) {
    try {
      const token = getAccessToken();
      if (!token) {
        return {
          error: true,
          message: 'Unauthorized',
          data: [],
          ok: false,
        };
      }

      const response = await fetch(
        `${BASE_URL}/stories?page=${page}&size=${size}&location=${includeLocation}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const responseJson = await response.json();
      
      return {
        error: responseJson.error || false,
        message: responseJson.message || '',
        data: responseJson.listStory || [],
        ok: !responseJson.error,
      };
    } catch (error) {
      return {
        error: true,
        message: error.message,
        data: [],
        ok: false,
      };
    }
  }

  static async getStoryDetail(id) {
    try {
      const token = getAccessToken();
      if (!token) {
        return {
          error: true,
          message: 'Unauthorized',
          data: null,
          ok: false,
        };
      }

      const response = await fetch(`${BASE_URL}/stories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const responseJson = await response.json();
      
      return {
        error: responseJson.error || false,
        message: responseJson.message || '',
        data: responseJson.story || null,
        ok: !responseJson.error,
      };
    } catch (error) {
      return {
        error: true,
        message: error.message,
        data: null,
        ok: false,
      };
    }
  }

  static async storeNewStory(data) {
    try {
      const token = getAccessToken();
      if (!token) {
        return {
          error: true,
          message: 'Unauthorized',
          data: null,
          ok: false,
        };
      }
      
      const formData = new FormData();

      formData.append('description', data.description);
      
      if (data.photo) {
        formData.append('photo', data.photo);
      }

      if (data.lat && data.lon) {
        formData.append('lat', data.lat);
        formData.append('lon', data.lon);
      }
      
      const response = await fetch(`${BASE_URL}/stories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      const responseJson = await response.json();
      
      return {
        error: responseJson.error || false,
        message: responseJson.message || '',
        data: responseJson.story || null,
        ok: !responseJson.error,
      };
    } catch (error) {
      return {
        error: true,
        message: error.message,
        data: null,
        ok: false,
      };
    }
  }
}

export default StoryApi;