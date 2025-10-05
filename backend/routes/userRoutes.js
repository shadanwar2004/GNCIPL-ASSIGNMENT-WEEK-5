import express from "express"
import { 
  getProfile,
    login,
    register
} from '../controller/userController.js';
import { protect } from "../middleware/authMiddleware.js";
const router=express.Router();


router.post('/register', register);
router.post('/login', login);
router.get("/",protect,getProfile)
export default router;
 
