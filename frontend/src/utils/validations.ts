export const validatePassword = (value: string): boolean => value.length > 5;
export const validateEmail = (value: string): boolean => value.includes("@");
export const validateUsername = (value: string): boolean => value.length > 2;
