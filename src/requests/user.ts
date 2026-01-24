export type CreateUserRequest = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

export type UpdateUserRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
};
