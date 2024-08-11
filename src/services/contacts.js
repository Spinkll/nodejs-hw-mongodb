import { ContactsCollection } from '../db/models/contact.js';
import { UsersCollection } from '../db/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder,
  sortBy,
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId });
  const contactCount = await ContactsCollection.find({ userId })
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactsById = async (contactcId, userId) => {
  const contact = await ContactsCollection.findById({
    _id: contactcId,
    userId,
  });
  return contact;
};

export const createContact = async (payload) => {
  const user = await UsersCollection.findById(payload.userId);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (userId, contactId, payload, options) => {
  const user = await UsersCollection.findById({ userId });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const rawResult = await ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    { new: true, ...options },
  );

  if (!rawResult) return null;

  return {
    contact: rawResult,
    isNew: Boolean(rawResult.upserted),
  };
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

  if (!contact) {
    return null; // Обработка отсутствия контакта
  }

  return contact;
};
