import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createContacts,
  getContacts,
  getContactsById,
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

export default router;
