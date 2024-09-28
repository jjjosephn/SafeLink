import React, {useState, useEffect} from 'react';
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
   
   /**
    * Fetch contact detail from API
    * @param {String} id
    * @returns {Promise<void>}
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
                  <button className='btn'><i className='bi bi-cloud-upload'></i> Change Photo</button>
               </div>
            </div>
            <div className='profile__settings'>Settings will go here</div>
         </div>
      </>
   );
}

export default ContactDetail