export interface ILogin {
  email: string;
  password: string;
}

export interface IResponseLogin {
  accessToken: string;
  refreshToken: string;
}
export interface IToken {
  token: string;
  userId: string;
  expiryDate: Date;
}
export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IResetPassword {
  password: string;
  resetToken: string;
}
export interface ILogout {
  message: string;
}

export interface IRefreshToken {
  refreshToken: string;
}
