
import { LoginFields } from './SignIn.types';

export function validateLogin(data: Record<LoginFields, string>) {
    const errors: Record<string, boolean> = {};

    errors[LoginFields.username] = !data[LoginFields.username]
    errors[LoginFields.password] = !data[LoginFields.password];

    return errors;
}