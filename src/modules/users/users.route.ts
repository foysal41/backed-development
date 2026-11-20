import { Router} from "express";
import auth from "../../middlewares/auth.middleware";
import { userController } from "./user.controller";






const router = Router()

// /api/v1/users/
router.post('/' , userController.createUser)
router.get('/' , auth('Admin', 'moderator'), userController.getAllUsers)
router.get('/:id', userController.getSingleUser)
router.put('/:id' , userController.updateUser)
router.delete('/:id', userController.deleteUser)


export const userRoute = router;