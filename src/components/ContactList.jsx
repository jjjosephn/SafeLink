import React, {useState} from 'react'
import Contact from "./Contact"

/**
 * ContactList that displays a list of contacts and handles pagination
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.data - Data containing objects and pagination
 * @param {Array<Objects>} props.data.content - Contact objects from the data
 * @param {number} props.data.totalPages - Total pages for pagination
 * @param {number} props.currentPage - Current page number
 * @param {Function} props.getAllContacts - Function that grabs contacts for a page
 * 
 * @returns {JSX.Element} The rendered ContactList component.
 */

const ContactList = ({data, currentPage, getAllContacts}) => {
  const [search, setSearch] = useState('');

  const filteredContacts = (data?.content || []).filter(contact => {
    return contact.name.toLowerCase().includes(search.toLowerCase());
  })

  console.log(search);
  return (
    <main className='main'>
      <span className='search'>
        <input 
            type='text' 
            placeholder='Search' 
            className='search-input'
            onChange={(e) => setSearch(e.target.value)}
        />
      </span>

      {/** Message when there are no contacts */}
      {filteredContacts.length === 0 && <div>No Contacts</div>}
      
      {/** Renders each contact component if there is at least one contact */}
      <ul className='contact__list'>
         {filteredContacts.length > 0 && 
          filteredContacts.map(contact => <Contact contact={contact} key={contact.id}/>)}
      </ul>

      {/** Pagination control */}
      {filteredContacts.length > 0 && data?.totalPages > 1 &&
      <div className='pagination'>

          {/** Previous page button disabled if page is 0 */}
          <a 
            onClick={() => getAllContacts(currentPage - 1)} 
            className={0 === currentPage ? 'disabled' : ''}
          > 
            &laquo;
          </a>

          {/** Renders page number */}
          {data && 
            [...Array(data.totalPages).keys()].map((page, index) => (
              <a 
                onClick={() => getAllContacts(page) }
                className={currentPage === page ? 'active' : ''}
                key={page}
              >
                {page + 1}
              </a>
            ))
          }

          {/** Next page button disabled if on the last page */}
          <a 
            onClick={() =>getAllContacts(currentPage + 1)} 
            className={data.totalPages === currentPage + 1 ? 'disabled' : ''}
          > 
            &raquo;
          </a>
      </div>
      }
    </main>
  )
}

export default ContactList