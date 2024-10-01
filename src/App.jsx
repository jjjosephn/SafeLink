import { useState, useEffect, useRef} from 'react';

import Header from './components/Header'
import ContactList from './components/ContactList'
import { getContacts, saveContact, updateContact, updatePhoto } from './api/ContactService';
import {Routes, Route, Navigate} from 'react-router-dom'
import ContactDetail from './components/ContactDetail';
import { toastError, toastSuccess } from './api/ToastService';
import { ToastContainer, toast } from 'react-toastify';

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
  * @property {string} relationship - Relationship with individual
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
   * Manage data in form
   * 
   * @type {[ContactData, Function]}
   */
  const [values, setValues] = useState({
    name: '',
    email: '',
    title: '',
    phone: '',
    address: '',
    relationship: ''
  })

  /**
   * Store photo file
   * 
   * @type {[File|undefined, Function]}
   */
  const [file, setFile] = useState(undefined)

  // Function to format phone numbers (123)456-7890
  const formatPhoneNumber = (value) => {
    const cleaned = ('' + value).replace(/\D/g, '');

    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)})${cleaned.slice(3, 6)}-${cleaned.slice(6)}`; // Adjusted formatting
    }
  return value;
  };

  /**
   * Handles change in form fields
   * 
   * @param {Event} e - Event change
   */
  const change = (e) => {
    const { name, value } = e.target;

    /* Format phone number */
    const formattedValue = name === 'phone' ? formatPhoneNumber(value) : value;

    setValues({ ...values, [name]: formattedValue });
  };

  /**
   * Reference modal element
   * 
   * @type {React.MutableRefObject}
   */
  const modalRef = useRef()


  /**
   * Reference modal element
   * 
   * @type {React.MutableRefObject}
   */
  const fileRef = useRef()


  /**
   * Fetches contacts from server
   * 
   * @async
   * @function getAllContacts
   * @param {number} [page = 0] - The page number to retrieve (default is 0)
   * @param {number} [size = 12] - Number of contacts per page (defaults to 12)
   * @returns {Promise<void>} - Updates data and current page
   * 
   * @throws - Logs any errors
   */
  const getAllContacts = async (page = 0, size = 12) => {
    try {
      setCurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
    } catch(error) {
      console.log(error);
      toastError(error.message);
    }
  }
  
  /**
   * Saves contact details including photo
   * 
   * @async
   * @function handleNewContact
   * @param {Event} e - Submission event
   * @returns {Promise<void>} - Handles form submission, resets form, and updates contact list
   * 
   * @throws {Error} - Logs any errors
   */
  const handleNewContact = async (e) => {
    /** Prevents refresh after form submission */
    e.preventDefault();
    try{
      /** Saves details excluding photo */
      const {data} = await saveContact(values);

      /** Create formdata to handle file upload */
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id', data.id);

      /** Upload and retreive photo url */
      const {data: photoUrl} = await updatePhoto(formData);
      getAllContacts();
      toastSuccess("Contact Added")
      toggleModal(false);
    }catch(error){
      console.log(error);
      toastError(error.message);
    }
  }

  /**
   * Reset modal input if false
   * 
   * @function
   * @param {boolean} show - Shown or hidden
   */
  const toggleModal = show => {
    if (!show){
      setValues({
        name: '',
        email: '',
        title: '',
        phone: '',
        address: '',
        relationship: ''
      })
      setFile(undefined);
      if (fileRef.current){
        fileRef.current.value = null;
      }
    }
    show ? modalRef.current.showModal() : modalRef.current.close();
  }

  /**
   * Updates contact by saving content
   * 
   * @async
   * @function updateContact
   * 
   * @param {Contact} contact
   * @returns {Promise<void>} - Contact is updated and fetched
   * 
   * @throws {Error} - Logs any error
   */
  const updateContact = async (contact) => {
    try{
      const {data} = await saveContact(contact);
      getAllContacts();
      console.log(data);
      toastSuccess("Contact Updated")
    }catch(error){
      console.log(error);
      toastError(error.message);
    }
  };

  /**
   * Updates image
   * 
   * @async
   * @function updateImage
   * 
   * @param {FormData} formData - Contains image file
   * @returns {Promise<void>} - Image is updated and contact is fetched
   * 
   * @throws {Error} - Logs any error
   */
  const updateImage = async (formData) => {
    try{
      const {data} = await updatePhoto(formData);
      getAllContacts();
      console.log(data)
      toastSuccess("Photo Updated")
    }catch(error){
      console.log(error);
      toastError(error.message);
    }
  };

  /**
   * Fetches contacts 
   * @function
   */
  useEffect (() => {
    getAllContacts();
  }, [])

  return (
    <>
      <Header 
        toggleModal = {toggleModal} 
        numOfContacts = {data.totalElements}
      />
      <main className="main">
        <div className="container">
          <Routes>

            {/** Default routing */}
            <Route 
              path='/' 
              element={
                <Navigate to={'/contacts'} />
              } 
            />

            {/** Contacts route shows list of contacts */}
            <Route 
              path="/contacts" 
              element={
                <ContactList 
                  data={data} 
                  currentPage={currentPage} 
                  getAllContacts={getAllContacts}
                />
              } 
            />

            {/** Route to show selected contact */}
            <Route 
              path="/contacts/:id" 
              element={
                <ContactDetail
                  updateContact = {updateContact} 
                  updateImage = {updateImage}
                />
              } 
            />  
          </Routes>
        </div>
      </main>

      {/** Modal Display */}
      <dialog ref={modalRef} className="modal" id="modal">
        <div className='modal__header'>
          <h3>New Contact</h3>
          {/** Toggles modal off if clicked */}
          <i onClick={() => toggleModal(false)} className='bi bi-x-lg'></i>
        </div>
        <div className='divider'/>
        <div className='modal__body'>
          {/** Saves new contact when save button is clicked */}
          <form onSubmit={handleNewContact}>
            <div className='user-details'>
              <div className='input-box'>
                <span className='details'>Name</span>
                {/** Handle input field changes */}
                <input type='text' value={values.name} onChange={change} name='name' required />
              </div>
              <div className='input-box'>
                <span className='details'>Email</span>
                <input type='text' value={values.email} onChange={change} name='email' required />
              </div>
              <div className='input-box'>
                <span className='details'>Title</span>
                <input type='text' value={values.title} onChange={change} name='title' required />
              </div>
              <div className='input-box'>
                <span className='details'>Phone</span>
                <input type='text' value={values.phone} onChange={change} name='phone' maxLength={13} required />
              </div>
              <div className='input-box'>
                <span className='details'>Address</span>
                <input type='text' value={values.address} onChange={change} name='address' required />
              </div>
              <div className='input-box'>
                <span className='details'>Relationship</span>
                <input type='text' value={values.relationship} onChange={change} name='relationship' required />
              </div>
              <div className='file-input'>
                <span className='details'>Profile Photo</span>
                {/** Handle file changes */}
                <input type='file' onChange={(event) => setFile(event.target.files[0])} ref={fileRef} name='photo' required />
              </div>
            </div>
            <div className='form_footer'>
              {/** Toggles modal off if clicked */}
              <button onClick={() => toggleModal(false)} className='btn btn-danger'> Cancel</button>
              <button type='submit' className='btn'>Save</button>
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer />
    </>
  )
}

export default App
