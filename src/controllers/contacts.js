import {
  createContact,
  getAllContacts,
  getContactsById,
  updateContact,
} from '../services/contacts.js';
import createError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const contacts = await getAllContacts({
    userId: req.user._id,
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactsByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactsById(contactId, req.user._id);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(400).json({
      status: 400,
      message: 'User ID is required',
    });
  }

  const contactData = { ...req.body, userId: req.user._id };

  const contact = await createContact(contactData);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const updateContactController = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(400).json({
      status: 400,
      message: 'User ID is required',
    });
  }
  const { contactId } = req.params;

  const updateData = { ...req.body, userId: req.user._id };

  const result = await updateContact(contactId, updateData);

  if (!result) {
    next(createError(404, 'Contact not found'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    next(createError(404, 'Contact not found'));
  }

  res.status(204).send();
};
