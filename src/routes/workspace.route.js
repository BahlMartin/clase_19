import express, {request} from 'express'
import  workspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import workspaceMiddleware from '../middlewares/workspace.middleware.js'

const workspace_router = express.Router()

workspace_router.post('/create',authMiddleware, workspaceController.createdWorkspace)

workspace_router.get('/search-by-user', authMiddleware, workspaceController.searchByUser)

workspace_router.delete('/delete', authMiddleware,workspaceMiddleware, workspaceController.deletebyid)

workspace_router.put('/update', authMiddleware,workspaceMiddleware, workspaceController.updateById)

export default workspace_router