import { useState, useEffect, useRef} from 'react';

import Header from './components/Header'
import ContactList from './components/ContactList'
import { getContacts, saveContact, updatePhoto } from './api/ContactService';
import {Routes, Route, Navigate} from 'react-router-dom'


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
    status: ''
  })

  /**
   * Store photo file
   * 
   * @type {[File|undefined, Function]}
   */
  const [file, setFile] = useState(undefined)

  /**
   * Handles change in form fields
   * 
   * @param {Event} e - Event change
   */
  const change = (e) => {
    setValues({... values, [e.target.name]: e.target.value});
    console.log(values)
  }

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
   * @param {number} [size = 10] - Number of contacts per page (defaults to 10)
   * @returns {Promise<void>} - Updates data and current page
   * 
   * @throws - Logs any errors
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
   * Saves contact details including photo
   * 
   * @async
   * @function handleNewContact
   * @param {Event} e - Submission event
   * @returns {Promise<void>} - Handles form submission, resets form, and updates contact list
   * 
   * @throws - Logs any errors
   */
  const handleNewContact = async (e) => {
    {/** Prevents refresh after form submission */}
    e.preventDefault();
    try{
      {/** Saves details excluding photo */}
      const {data} = await saveContact(values);

      {/** Create formdata to handle file upload */}
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id', data.id);

      {/** Upload and retreive photo url */}
      const {data: photoUrl} = await updatePhoto(formData);

      {/** Close modal, reset form, and update contact list */}
      toggleModal(false);
      console.log(photoUrl);
      setFile(undefined);
      fileRef.current.value = null;
      setValues({
        name: '',
        email: '',
        title: '',
        phone: '',
        address: '',
        status: ''
      })
      getAllContacts();
    }catch(error){
      console.log(error);
    }
  }

  /**
   * Display of modal
   * 
   * @function
   * @param {boolean} show - Shown or hidden
   */
  const toggleModal = show => show ? modalRef.current.showModal() : modalRef.current.close();

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

            {/** Contacts route shows lsit of contacts */}
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
                <input type='text' value={values.phone} onChange={change} name='phone' required />
              </div>
              <div className='input-box'>
                <span className='details'>Address</span>
                <input type='text' value={values.address} onChange={change} name='address' required />
              </div>
              <div className='input-box'>
                <span className='details'>Account Status</span>
                <input type='text' value={values.status} onChange={change} name='status' required />
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
    </>
  )
}

export default App
