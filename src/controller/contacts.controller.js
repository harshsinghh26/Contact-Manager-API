import { Contact } from '../models/contact.models.js';
import { User } from '../models/users.models.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ansycHandler } from '../utils/AsyncHandler.js';
import { uploadOnCloudnary } from '../utils/Cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// creating contacts

const createContacts = ansycHandler(async (req, res) => {
  const { name, phone, email, address } = req.body;
  const user = await User.findById(req.user?._id);

  if (!(name && email && phone && address)) {
    throw new ApiError(400, 'All Fields are required!!');
  }

  const duplicateContact = await Contact.findOne({
    $or: [{ name }, { phone }],
    user: req.user._id,
  });

  if (duplicateContact) {
    throw new ApiError(409, 'contact Already Exist!!');
  }

  //   const contactAvatarFilePath = req.files?.avatar[0]?.path;

  //   if (!contactAvatarFilePath) {
  //     throw new ApiError(400, 'Avatar is required');
  //   }
  let contactAvatarFilePath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    contactAvatarFilePath = req.files.avatar[0].path;
  }

  const contactAvatar = await uploadOnCloudnary(contactAvatarFilePath);

  //   if (!contactAvatar) {
  //     throw new ApiError(400, 'Avatar is required!!');
  //   }

  const createContacts = await Contact.create({
    name,
    email,
    phone,
    address,
    avatar: contactAvatar?.url || '',
    avatarId: contactAvatar?.public_id || '',
    userId: user,
  });

  if (!createContacts) {
    throw new ApiError(500, 'Something went wrong while creating contacts!!');
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { createContacts, user: user.username },
        'Contacts Created Successfully!!',
      ),
    );
});

// Get All contacts

const getContacts = ansycHandler(async (req, res) => {
  const contact = await Contact.find({ user: req.user?._id });

  return res
    .status(200)
    .json(new ApiResponse(200, contact, 'Contacts Fetched Successfully!!'));
});

// get contacts by id

const getContactsById = ansycHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  return res
    .status(200)
    .json(new ApiResponse(200, contact, 'Contact fetched Successfully!!'));
});

// Update contact details

const updateContactDetails = ansycHandler(async (req, res) => {
  const { name, phone } = req.body;
  const { id } = req.params;

  if (!(name && phone)) {
    throw new ApiError(400, 'All Fields are Required');
  }

  const contacts = await Contact.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
        phone,
      },
    },
    { new: true },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, contacts, 'Contacts details changed successfully!!'),
    );
});

// Update contact avatar

const updateContactAvatar = ansycHandler(async (req, res) => {
  const avatarFilePath = req.file?.path;
  const { id } = req.params;

  const contactId = await Contact.findById(id);

  if (!contactId) {
    throw new ApiError(404, 'Contact not found!!');
  }

  if (!avatarFilePath) {
    throw new ApiError(400, 'Avatar is Required!!');
  }

  const avatar = await cloudinary.uploader.upload(avatarFilePath, {
    public_id: contactId?.avatarId,
    overwrite: true,
  });

  fs.unlinkSync(avatarFilePath);

  if (!avatar.url) {
    throw new ApiError(500, 'Server Error while Uploading!!');
  }
  const contact = await Contact.findByIdAndUpdate(
    id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, contact, 'Avatar Chnaged Successfully!!'));
});

// Delete Contact

const deleteContact = ansycHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  if (!contact) {
    throw new ApiError(404, 'Contact not found!!');
  }

  if (contact.avatarId) {
    await cloudinary.uploader.destroy(contact.avatarId);
  }

  await Contact.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Contact deleted Successfully!!'));
});

export {
  createContacts,
  getContacts,
  getContactsById,
  updateContactDetails,
  updateContactAvatar,
  deleteContact,
};
