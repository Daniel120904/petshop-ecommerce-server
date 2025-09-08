import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validateDto } from "../middlewares/validationsMiddleware";
import { userValidations } from "../validations/userValidations";

const router = Router()
const userController = new UserController()

router.post("/createUser", validateDto(userValidations.createUser), (req, res) => userController.createUser(req, res))
router.post("/createTelefone", validateDto(userValidations.createTelefone), (req, res) => userController.createTelefone(req, res))
router.post("/createEndereco", validateDto(userValidations.createEndereco), (req, res) => userController.createEndereco(req, res))
router.post("/createCartao", validateDto(userValidations.createCartao), (req, res) => userController.createCartao(req, res))

router.put("/updateUser", validateDto(userValidations.updateUser), (req, res) => userController.updateUser(req, res))
router.put("/updateTelefone", validateDto(userValidations.updateTelefone), (req, res) => userController.updateTelefone(req, res))
router.put("/updateSenha", validateDto(userValidations.updateSenha), (req, res) => userController.updateSenha(req, res))
router.put("/updateEndereco", validateDto(userValidations.updateEndereco), (req, res) => userController.updateEndereco(req, res))
router.put("/updateCartaoPreferencial", validateDto(userValidations.updateCartaoPreferencial), (req, res) => userController.updateCartaoPreferencial(req, res))
router.put("/updateStatusUser", validateDto(userValidations.updateStatusUser), (req, res) => userController.updateStatusUser(req, res))

router.get("/getUsers", (req, res) => userController.getUsers(req, res))

router.delete("/deleteUser", (req, res) => userController.deleteUser(req, res))

export default router
