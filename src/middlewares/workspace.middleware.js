import  ServerError  from "../helpers/serverError.helpers.js";
import jwt from 'jsonwebtoken'
import ENVIROMENT from "../config/enviroment.config.js";
import Workspace from "../repositories/workspace.repository.js";
import WorkspaceMember from "../repositories/workspaceMember.repository.js";

async function workspaceMiddleware(request, response, next) {
    try{
        const user_id = request.user.id
        const workspace_id = request.query.workspace_id

        if (!workspace_id) {
            throw new ServerError("No se proporciono el id del espacio de trabajo", 400)
        }

        const workspace = await Workspace.getById(workspace_id) 
        if (!workspace) {
            throw new ServerError("No se encontro el espacio de trabajo", 404)
        }

        const worskpaces_user = await WorkspaceMember.getByUserId(user_id)

        const membership = worskpaces_user.find(
            (membership) => membership.fk_workspace_id.toString() === workspace_id
        )
        
        if (!membership) {
            throw new ServerError("No eres miembro de este espacio de trabajo", 403)
        }

        request.workspace = workspace
        request.membership = membership

        return next()

    }catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return response.status(401).json({
                message: "Token de autorizacion invalido",
                ok: false,
                status: 401
            })
        }
        if (error instanceof ServerError) {
            return response.status(error.status).json(
                {
                    message: error.message,
                    ok: false,
                    status: error.status
                }
                )
            }
            else {
                    console.error('Error critico:', error);
                    return response.status(500).json({
                        message: "Error interno del servidor",
                        ok: false,
                        status: 500
                    });
            }
    
    }
}

export default workspaceMiddleware