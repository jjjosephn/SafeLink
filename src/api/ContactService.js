import axios from "axios"

//Base URL
const API_URL = "http://localhost:8080/contacts";


/**
 * Contact Object
 * 
 * @typedef {Object} Contact
 * @property {string} id - Contact ID
 * @property {string} name - Name of contact
 * @property {string} email - Email of contact
 * @property {string} title  - Title of contact
 * @property {string} address - Address of contact
 * @property {string} status - Active or inactive
 * @property {string} photoUrl - Photo of contact
 */

/**
 * Saves a new contact by sending a POST request to API
 * 
 * @param {Contact} contact - The saved contact object
 * @returns {Promise<Object>} - Saved contact 
 */
export async function saveContact(contact){
   return await axios.post(API_URL, contact);
}

/**
 * Retrieves contacts from the API with pagination
 * 
 * @param {number} [page = 0] - The page number to retrieve (default is 0)
 * @param {number} [size = 10] - Number of contacts per page (defaults to 10)
 * @returns {Promise<Object>} - A list of contacts from API
 */

export async function getContacts(page = 0, size = 10){
   return await axios.get(`${API_URL}?page=${page}?size=${size}`);
}

/**
 * Retrieves contact from the API using id
 * 
 * @param {string} id - ID used to retreive info
 * @returns {Promise<Object>} - The contact retrieved from API
 */
export async function getContact(id){
   return await axios.post(`${API_URL}/${id}`);
}

/**
 * Updates an existing contact sending a POST request to API
 * 
 * @param {Contact} contact - The updated contact
 * @returns {Promise<Object>} - The updated contact from API
 */
export async function updateContact(contact){
   return await axios.post(API_URL, contact);
}

/**
 * Updates photo of a contact sending a PUT request to API
 * 
 * @param {FormData} formData - The formdata containing the contact's photo
 * @returns {Promise<Object>} - The updated photo from API
 */
export async function updatePhoto(formData){
   return await axios.put(`${API_URL}/photo`, formData);
}

/**
 * Deletes a contact by ID by sending a DELETE request to API
 * 
 * @param {number} id - ID of contact to delete
 * @returns {Promise<void>} - Deleted contact
 */
export async function deleteContact(id){
   return await axios.delete(`${API_URL}/${id}`);
}