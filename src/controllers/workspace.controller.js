import ServerError from "../helpers/serverError.helpers.js";
import workspaceRepository from "../repositories/workspace.repository.js";
import ENVIROMENT from "../config/enviroment.config.js";
import workspacememberRepository from "../repositories/workspaceMember.repository.js";
import MEMBER_WORKSPACE_ROLES from "../constants/memberRoles.constants.js";
class WorkspaceController {

    async createdWorkspace(request, response) {
        try {
            const {nombre,descripcion} = request.body
            const userId = request.user.id
            if(!nombre){
                throw new ServerError("El nombre es requerido", 400)
            }
            if(nombre.length < 2){
                throw new ServerError("El nombre debe tener al menos 2 caracteres", 400)
            }
            if(!descripcion){
                throw new ServerError("La descripcion es requerida", 400)
            }
            //creo el espacio de trabajo
            const created_workspace = await workspaceRepository.create(nombre, descripcion)
            
            //creo la membresia del usuario que creo el espacio de trabajo

            const created_membership = await workspacememberRepository.create(userId, created_workspace._id, MEMBER_WORKSPACE_ROLES.OWNER)
            
            
            return response.status(200).json({
                message: "Espacio de trabajo creado exitosamente",
                ok: true,
                status: 200,
                data:{
                    workspace: created_workspace,
                    membership: created_membership
                }
            });
        } catch (error) {
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
}
const workspaceController = new WorkspaceController()
export default workspaceController