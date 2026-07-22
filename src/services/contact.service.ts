import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export interface ICreateContactData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export const contactService = {
  async sendContact(data: ICreateContactData) {
    const res: any = await apiService.post(
      API_ENDPOINTS.CONTACT.CREATE,
      data,
    );
    return res?.data;
  },
};

export default contactService;
