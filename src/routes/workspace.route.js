import express, {request} from 'express'
import  workspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const workspace_router = express.Router()

workspace_router.post('/create',authMiddleware, workspaceController.createdWorkspace)

export default workspace_router