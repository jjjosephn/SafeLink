import { useState, useEffect } from 'react';
import './App.css'

import Header from './components/Header'
import { getContacts } from './api/ContactService';


/**
 * App fetches contact data
 * @function
 */
function App() {
  /**
   * @typedef {Object} ContactData
  * @property {string} id - Contact ID
  * @property {string} name - Name of contact
  * @property {string} email - Email of contact
  * @property {string} title  - Title of contact
  * @property {string} address - Address of contact
  * @property {string} status - Active or inactive
  * @property {string} photoUrl - Photo of contact
   */

  /**
   * Store contact data
   * 
   * @type {[ContactData[], Function]}
   */
  const[data, setData] = useState({});

  /**
   * Store page number
   * 
   * @type {[number, Function]}
   */
  const [currentPage, setCurrentPage] = useState(0)


  /**
   * Fetches contacts from server
   * 
   * @async
   * @function getAllContacts
   * @param {number} [page = 0] - The page number to retrieve (default is 0)
   * @param {number} [size = 10] - Number of contacts per page (defaults to 10)
   * @returns {Promise<void>} - Updates data and current page
   */
  const getAllContacts = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
      console.log(data);
    } catch(error) {
      console.log(error)
    }
  }

  /**
   * Display of modal
   * 
   * @function
   * @param {boolean} show - Shown or hidden
   */
  const toggleModal = (show) => {}

  /**
   * Fetches contacts 
   * @function
   */
  useEffect (() => {
    getAllContacts();
  }, [])

  return (
    <>
      <Header toggleModal = {toggleModal} numOfContacts = {data.totalElements}/>
    </>
  )
}

export default App
