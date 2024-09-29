import React, {useState, useEffect, useRef} from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContact } from '../api/ContactService';

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
      name: '',
      email: '',
      title: '',
      phone: '',
      address: '',
      status: '',
      photoUrl: ''
   });

   const { id } = useParams();
   const inputRef = useRef()
   
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
            <div className='profile__settings'>Settings will go here</div>
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