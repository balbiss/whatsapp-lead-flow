import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const BASE_URL = process.env.WUZAPI_BASE_URL || 'https://weeb.inoovaweb.com.br';
const ADMIN_TOKEN = process.env.WUZAPI_ADMIN_TOKEN;

export class WuzapiService {
  private static getAdminConfig() {
    return {
      headers: {
        'Authorization': `${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
  }

  private static getUserConfig(token: string) {
    return {
      headers: {
        'token': token,
        'Content-Type': 'application/json'
      }
    };
  }

  static async createUser(name: string, token: string) {
    try {
      const response = await axios.post(`${BASE_URL}/admin/users`, {
        name,
        token
      }, this.getAdminConfig());
      return response.data;
    } catch (error: any) {
      console.error('Wuzapi createUser error:', error.response?.data || error.message);
      throw error;
    }
  }

  static async getStatus(token: string) {
    try {
      const response = await axios.get(`${BASE_URL}/session/status`, this.getUserConfig(token));
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Wuzapi getStatus error:', error.response?.data || error.message);
      return { Connected: false, LoggedIn: false };
    }
  }

  static async connect(token: string) {
    try {
      const response = await axios.post(`${BASE_URL}/session/connect`, {
        Subscribe: ["Message", "Presence", "ChatState"],
        Immediate: true
      }, this.getUserConfig(token));
      
      return response.data;
    } catch (error: any) {
      console.error('Wuzapi connect error:', error.response?.data || error.message);
      return { status: 'error', message: error.response?.data?.message || error.message };
    }
  }

  static async getQR(token: string) {
    try {
      const response = await axios.get(`${BASE_URL}/session/qr`, this.getUserConfig(token));
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Wuzapi getQR error:', error.response?.data || error.message);
      return { status: 'error', message: error.message };
    }
  }

  static async pairPhone(token: string, phone: string) {
    try {
      const response = await axios.post(`${BASE_URL}/session/pairphone`, {
        Phone: phone
      }, this.getUserConfig(token));
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Wuzapi pairPhone error:', error.response?.data || error.message);
      return { status: 'error', message: error.message };
    }
  }

  static async disconnect(token: string) {
    try {
      const response = await axios.post(`${BASE_URL}/session/disconnect`, {}, this.getUserConfig(token));
      return response.data;
    } catch (error: any) {
      console.error('Wuzapi disconnect error:', error.response?.data || error.message);
      throw error;
    }
  }

  static async sendMessage(token: string, phone: string, body: string) {
    try {
      const response = await axios.post(`${BASE_URL}/chat/send`, {
        Phone: phone,
        Body: body
      }, this.getUserConfig(token));
      return response.data;
    } catch (error: any) {
      console.error('Wuzapi sendMessage error:', error.response?.data || error.message);
      throw error;
    }
  }

  static async deleteUser(token: string) {
    try {
      const response = await axios.delete(`${BASE_URL}/admin/users?token=${token}`, this.getAdminConfig());
      return response.data;
    } catch (error: any) {
      console.error('Wuzapi deleteUser error:', error.response?.data || error.message);
      throw error;
    }
  }
}
