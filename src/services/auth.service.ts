import apiService from './api.service';
import { API_ENDPOINTS } from './endpoint';
import type {
  UserLoginReq,
  SendOtpCustomerReq,
  SendOtpVerifyReq,
  VerifyOtpReq,
  RegisterReq,
  ForgotPasswordCustomerReq,
  GoogleLoginReq,
  FacebookLoginReq,
  RefreshTokenReq,
  ChangePasswordReq,
  UpdatePasswordReq,
  UserLogInResponseDto,
  RefreshTokenResponseDto,
  UserInfoResponseDto,
} from '@/dto';

export const authService = {
  login: async (data: UserLoginReq): Promise<UserLogInResponseDto> => {
    const response = await apiService.post<UserLogInResponseDto>(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  sendOtpRegistration: async (data: SendOtpCustomerReq): Promise<{ message: string; otpCode?: string }> => {
    const response = await apiService.post<{ message: string; otpCode?: string }>(
      API_ENDPOINTS.AUTH.SEND_OTP_REGISTRATION, data);
    return response.data;
  },

  sendOtpVerify: async (data: SendOtpVerifyReq): Promise<{ message: string; otpCode?: string }> => {
    const response = await apiService.post<{ message: string; otpCode?: string }>(
      API_ENDPOINTS.AUTH.SEND_OTP_VERIFY, data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpReq): Promise<UserLogInResponseDto> => {
    const response = await apiService.post<UserLogInResponseDto>(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
    return response.data;
  },

  register: async (data: RegisterReq): Promise<{ message: string; user?: any }> => {
    const response = await apiService.post<{ message: string; user?: any }>(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordCustomerReq): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    return response.data;
  },

  loginWithGoogle: async (data: GoogleLoginReq): Promise<UserLogInResponseDto> => {
    const response = await apiService.post<UserLogInResponseDto>(API_ENDPOINTS.AUTH.LOGIN_GOOGLE, data);
    return response.data;
  },

  loginWithFacebook: async (data: FacebookLoginReq): Promise<UserLogInResponseDto> => {
    const response = await apiService.post<UserLogInResponseDto>(API_ENDPOINTS.AUTH.LOGIN_FACEBOOK, data);
    return response.data;
  },

  refreshToken: async (data: RefreshTokenReq): Promise<RefreshTokenResponseDto> => {
    const response = await apiService.post<RefreshTokenResponseDto>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, data);
    return response.data;
  },

  getUserInfo: async (): Promise<UserInfoResponseDto> => {
    const response = await apiService.post<UserInfoResponseDto>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  changePassword: async (data: ChangePasswordReq): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    return response.data;
  },

  updatePassword: async (data: UpdatePasswordReq): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, data);
    return response.data;
  },
};

export default authService;
