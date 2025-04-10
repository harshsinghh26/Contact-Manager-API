import app from '../app.js';
import { Contact } from '../models/contact.models.js';
import { User } from '../models/users.models.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ansycHandler } from '../utils/AsyncHandler.js';
import { uploadOnCloudnary } from '../utils/Cloudinary.js';

// creating contacts

const createContacts = ansycHandler(async (req, res) => {
  const { name, phone, email, address } = req.body;
  const user = await User.findById(req.user._id);

  if (!(name && email && phone && address)) {
    throw new ApiError(400, 'All Fields are required!!');
  }

  const duplicateContact = await Contact.findOne({
    $or: [{ name }, { phone }],
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
    userId: user,
  });

  if (!createContacts) {
    throw new ApiError(500, 'Something went wrong while creating contacts!!');
  }
  return res
    .status(201)
    .json(
      new ApiResponse(200, createContacts, 'Contacts Created Successfully!!'),
    );
});

export { createContacts };
