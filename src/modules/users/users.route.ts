import { Router} from "express";
import auth from "../../middlewares/auth.middleware";
import { userController } from "./user.controller";






const router = Router()

// /api/v1/users/
router.post('/' ,auth, userController.createUser)
router.get('/' , auth, userController.getAllUsers)
router.get('/:id', userController.getSingleUser)
router.put('/:id' , userController.updateUser)
router.delete('/:id', userController.deleteUser)


export const userRoute = router;