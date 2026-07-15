export interface UserLoginReq {
  email: string;
  password: string;
}

export interface SendOtpCustomerReq {
  email?: string;
  phone?: string;
  sendMethod: "EMAIL" | "PHONE";
}

export interface SendOtpVerifyReq {
  identifier: string;
  method: "EMAIL" | "PHONE";
}

export interface VerifyOtpReq {
  identifier: string;
  otpCode: string;
  method: "EMAIL" | "PHONE";
}

export interface RegisterReq {
  name: string;
  email: string;
  phone: string;
  password: string;
  otpCode: string;
  sendMethod: "EMAIL" | "PHONE";
  gender?: string;
}

export interface ForgotPasswordCustomerReq {
  identifier: string;
  otpCode: string;
  newPassword: string;
  method: "EMAIL" | "PHONE";
}

export interface GoogleLoginReq {
  idToken: string;
}

export interface FacebookLoginReq {
  accessToken: string;
}

export interface RefreshTokenReq {
  refreshToken: string;
}

export interface UpdatePasswordReq {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordReq extends UpdatePasswordReq {
  confirmPassword: string;
}

export interface UserSessionDto {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  role: string;
  isActive?: boolean;
  customer?: any;
}

export interface UserLogInResponseDto {
  user: UserSessionDto;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface UserInfoResponseDto {
  data: UserSessionDto;
  message?: string;
}

export interface CheckPhoneEmailReq {
  email?: string;
  phone?: string;
}

export interface CheckPhoneEmailRes {
  message: string;
}

export interface VerifyEmailReq {
  email: string;
  otpCode: string;
}

export interface ResendVerificationReq {
  email: string;
}

export interface CleanTokensRes {
  message: string;
  deletedCount: number;
}

export interface AuthState {
  user: UserSessionDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
