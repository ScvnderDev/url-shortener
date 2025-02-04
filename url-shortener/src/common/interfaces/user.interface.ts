export interface IUser {
  id?: string;
  fullName: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updateAt?: Date;
}
