import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactsById = async (contactcId) => {
  const contact = await ContactsCollection.findById(contactcId);
  return contact;
};
