import React, {useState, useEffect, useRef} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getContact } from '../api/ContactService';

import 'react-toastify/dist/ReactToastify.css'; 

/**
 * ContactDetail to show details of a selected contact
 * 
 * @param {Object} props
 * @param {Function} props.updateContact - Function to update contact details
 * @param {Function} props.updateImage - Function to update image
 * @returns 
 */
const ContactDetail = ({updateContact, updateImage}) => {
   const [contact, setContact] = useState({
      id: '',
      name: '',
      email: '',
      title: '',
      phone: '',
      address: '',
      relationship: '',
      photoUrl: ''
   });

   const { id } = useParams();
   const inputRef = useRef()
   const navigate = useNavigate();
   
   /**
    * Fetch contact detail from API
    * @param {String} id
    * @returns {Promise<void>}
    * 
    * @throws {Error}
    */
   const fetchContact = async (id) => {
      try{
         {/** Saves details*/}
         const {data} = await getContact(id);
         setContact(data);
      } catch(error){
        console.log(error);
      }
   };

   /**
    * Allows user to select image
    * @returns {void}
    */
   const selectImage = () => {
      inputRef.current.click();
   }

   /**
    * Formats a phone number into (123)456-7890.
    * 
    * @param {string} value - The input phone number as a string.
    * @returns {string} - The formatted phone number, or the original input if it's not a valid 10-digit number.
    */
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

    setContact({ ...contact, [name]: formattedValue });
   }

   /**
   * Updates form when submitted
   * 
   * @param {Event} e - Event change
   */
   const onUpdate = async(e) => {
      e.preventDefault();
      await updateContact(contact);
      fetchContact(id);
      navigate('/contacts');
   }

   /**
    * Updates contact's photo by uploading a new photo
    * 
    * @param {File} file - The file to be uploaded
    * @returns {Promise<void>} - Successfully uploaded photo
    * 
    * @throws {Error}
    */
   const updatePhoto = async(file) => {
      try{
         const formData = new FormData();
         formData.append('file', file, file.name);
         formData.append('id', id);
         await updateImage(formData);
         setContact((prev) => ({ ...prev, photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}`}));
      } catch(error){
        console.log(error);
      }
   }

   useEffect (() => {
      fetchContact(id);
   }, []);

   /** Display contact */
   return (
      <>
         <Link to="/contacts" className="link">
            <i className='bi bi-arrow-left'/>
               Back to List
         </Link>
         <div className='profile'>
            <div className='profile__details'>
               <img src={contact.photoUrl} alt={`Profile photo of ${contact.name}`} />
               <div className='profile__metadata'>
                  <p className='profile__name'>{contact.name}</p>
                  <p className='profile__muted'>JPG, GIF, or PNG. Max size of 10MG</p>
                  {/** Change Photo */}
                  <button onClick={selectImage} className='btn'><i className='bi bi-cloud-upload'></i> Change Photo</button>
               </div>
            </div>
            <div className='profile__settings'>
               <div>
                  {/** Update function when form is submitted */}
                  <form onSubmit={onUpdate} className='form'>
                     <div className='user-details'>
                        <input type='hidden' defaultValue={contact.id} name='id' required/>
                        <div className='input-box'>
                           <span className='details'>Name</span>
                           <input type='text' value={contact.name} onChange={change} name='name' required/>
                        </div>
                        <div className='input-box'>
                           <span className='details'>Email</span>
                           <input type='text' value={contact.email} onChange={change} name='email' required/>
                        </div>
                        <div className='input-box'>
                           <span className='details'>Phone</span>
                           <input type='text' value={contact.phone} onChange={change} name='phone' maxLength={13} required/>
                        </div>
                        <div className='input-box'>
                           <span className='details'>Address</span>
                           <input type='text' value={contact.address} onChange={change} name='address' required/>
                        </div>
                        <div className='input-box'>
                           <span className='details'>Title</span>
                           <input type='text' value={contact.title} onChange={change} name='title' required/>
                        </div>
                        <div className='input-box'>
                           <span className='details'>Relationship</span>
                           <input type='text' value={contact.relationship} onChange={change} name='relationship' required/>
                        </div>
                     </div>
                     <div className='form_footer'>
                        <button type='submit' className='btn'>Save</button>
                     </div>
                  </form>
               </div>
            </div>
         </div>
         
         {/** Form just for uploading a new profile pic */}
         <form style={{display: 'none'}}>
            <input 
               type='file' 
               ref={inputRef} 
               onChange={(event) => updatePhoto(event.target.files[0])}
               name='file'
               accept='image/*'/>
         </form>
      </>
   );
}

export default ContactDetail