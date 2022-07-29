export const passwordValidation = (password: string) => {
	return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,25}$/.test(
		password,
	);
};
