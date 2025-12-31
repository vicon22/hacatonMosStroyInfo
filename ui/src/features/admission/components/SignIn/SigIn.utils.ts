
import { LoginFields } from './SignIn.types';

export function validateLogin(data: Record<LoginFields, string>) {
    const errors: Record<string, boolean> = {};

    errors[LoginFields.email] = !data[LoginFields.email]
    errors[LoginFields.password] = !data[LoginFields.password];

    return errors;
}