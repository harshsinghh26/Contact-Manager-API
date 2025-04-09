import { Router } from 'express';
import { userRegister } from '../controller/users.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router
  .route('/register')
  .post(upload.fields([{ name: 'avatar', maxCount: 1 }]), userRegister);

export default router;
