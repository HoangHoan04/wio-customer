import type {
  ChangePasswordReq,
  CheckPhoneEmailReq,
  CheckPhoneEmailRes,
  CleanTokensRes,
  FacebookLoginReq,
  ForgotPasswordCustomerReq,
  GoogleLoginReq,
  RefreshTokenReq,
  RefreshTokenResponseDto,
  RegisterReq,
  ResendVerificationReq,
  SendOtpCustomerReq,
  SendOtpVerifyReq,
  UpdatePasswordReq,
  UserInfoResponseDto,
  UserLoginReq,
  UserLogInResponseDto,
  VerifyEmailReq,
  VerifyOtpReq,
} from "@/dto";
import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const authService = {
  login: async (data: UserLoginReq): Promise<UserLogInResponseDto> => {
    const response = await apiService.post<UserLogInResponseDto>(
      API_ENDPOINTS.AUTH.LOGIN,
      data,
    );
    return response.data;
  },

  sendOtpRegistration: async (
    data: SendOtpCustomerReq,
  ): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.SEND_OTP_REGISTRATION,
      data,
    );
    return response.data;
  },

  sendOtpVerify: async (
    data: SendOtpVerifyReq,
  ): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.SEND_OTP_VERIFY,
      data,
    );
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpReq): Promise<UserLogInResponseDto> => {
    const response = await apiService.post<UserLogInResponseDto>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      data,
    );
    return response.data;
  },

  register: async (data: RegisterReq): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.REGISTER,
      data,
    );
    return response.data;
  },

  forgotPassword: async (
    data: ForgotPasswordCustomerReq,
  ): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data,
    );
    return response.data;
  },

  loginWithGoogle: async (
    data: GoogleLoginReq,
  ): Promise<UserLogInResponseDto> => {
    const response = await apiService.post<UserLogInResponseDto>(
      API_ENDPOINTS.AUTH.LOGIN_GOOGLE,
      data,
    );
    return response.data;
  },

  loginWithFacebook: async (
    data: FacebookLoginReq,
  ): Promise<UserLogInResponseDto> => {
    const response = await apiService.post<UserLogInResponseDto>(
      API_ENDPOINTS.AUTH.LOGIN_FACEBOOK,
      data,
    );
    return response.data;
  },

  refreshToken: async (
    data: RefreshTokenReq,
  ): Promise<RefreshTokenResponseDto> => {
    const response = await apiService.post<RefreshTokenResponseDto>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      data,
    );
    return response.data;
  },

  getUserInfo: async (): Promise<UserInfoResponseDto> => {
    const response = await apiService.post<UserInfoResponseDto>(
      API_ENDPOINTS.AUTH.ME,
    );
    return response.data;
  },
  updateProfile: async (data: any): Promise<any> => {
    const response = await apiService.post<any>(
      API_ENDPOINTS.AUTH.UPDATE_PROFILE,
      data,
    );
    return response.data;
  },

  logout: async (refreshToken?: string): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.LOGOUT,
      refreshToken ? { refreshToken } : {},
    );
    return response.data;
  },

  changePassword: async (
    data: ChangePasswordReq,
  ): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      data,
    );
    return response.data;
  },

  updatePassword: async (
    data: UpdatePasswordReq,
  ): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.UPDATE_PASSWORD,
      data,
    );
    return response.data;
  },

  checkPhoneEmail: async (
    data: CheckPhoneEmailReq,
  ): Promise<CheckPhoneEmailRes> => {
    const response = await apiService.post<CheckPhoneEmailRes>(
      API_ENDPOINTS.AUTH.CHECK_PHONE_EMAIL,
      data,
    );
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailReq): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      data,
    );
    return response.data;
  },

  resendVerification: async (
    data: ResendVerificationReq,
  ): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
      data,
    );
    return response.data;
  },

  cleanTokens: async (): Promise<CleanTokensRes> => {
    const response = await apiService.post<CleanTokensRes>(
      API_ENDPOINTS.AUTH.CLEAN_TOKENS,
    );
    return response.data;
  },
};

export default authService;
