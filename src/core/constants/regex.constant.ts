export const isPhoneNumber = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/

export const isNumber = /^[0-9\b]+$/

export const base64Rex = /data:image\/[a-z]*;base64,[^"]+/g

export const urlRex = RegExp('^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
