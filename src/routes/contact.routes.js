import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createContacts,
  deleteContact,
  getContacts,
  getContactsById,
  updateContactAvatar,
  updateContactDetails,
} from '../controller/contacts.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/create-contact').post(
  upload.fields([{ name: 'avatar', maxCount: 1 }]),
  //   upload.single('avatar'),
  verifyJWT,
  createContacts,
);
router.route('/get-contact').get(getContacts);
router.route('/get-contact/:id').get(verifyJWT, getContactsById);
router.route('/update/:id').patch(verifyJWT, updateContactDetails);
router
  .route('/update-avatar/:id')
  .patch(verifyJWT, upload.single('avatar'), updateContactAvatar);
router.route('/delete/:id').delete(verifyJWT, deleteContact);

export default router;
