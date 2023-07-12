import fs from 'fs'

export function clearTempFile(file: string){
	fs.unlink(file, ()=>{})
}

export const validatePhoneNumber = (number: string)=>{

	if(number.length != 10 && number.length != 11){
		return false
	}

	const intNumber = parseInt(number)
	if(isNaN(intNumber)){
		return false
	}

	return true
	/* const cleanNumber = number.replace(/[^\d]/g, "");

	if (cleanNumber.length !== 10 && cleanNumber.length !== 11) {
		return false;
	}

	const repeatedDigitsRegex = /^(\d)\1+$/;
	if (repeatedDigitsRegex.test(cleanNumber)) {
		return false;
	}

	const regex = /^[2-5]\d{3}-?\d{4}$|^9\d{4}-?\d{4}$/;
	return regex.test(cleanNumber); */
}

export const validateLinkedInProfile = (username: string)=>{
	const url = `https://www.linkedin.com/in/${username}`
	const trimmedUrl = url.trim();
	const regex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
	return regex.test(trimmedUrl);
}

export const validateGitHubProfile = (username: string)=>{
	const url = `https://github.com/${username}` 
	const trimmedUrl = url.trim();
	const regex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
	return regex.test(trimmedUrl);
}
/* Créditos para fazlulkarimweb https://github.com/fazlulkarimweb/string-sanitizer */
export const isEmail = (email: string)=>{
	const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (regex.test(email)) {
		return email;
	} else {
		return false;
	}
}

export const isPassword = (password: string)=>{
	const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
	if (regex.test(password)) {
		return password;
	} else {
		return false;
	}
}

export const isUsername = (username: string)=>{
	const regex = /^[a-z][a-z]+\d*$|^[a-z]\d{2,}$/i;
	if (regex.test(username)) {
		return username.toLowerCase();
	} else {
		return false;
	}
}
