const usuarios = {
    props: ['forms'],
    data() {
        return {
            usuario: {
                idUsuario: 0,
                usuario: "",
                clave: ""
            },
            accion: 'nuevo',
            idUsuario: 0,
            data_usuarios: []
        }
    },
    methods: {
        async guardarUsuario() {
            try {
                if (this.usuario.usuario.trim() === "" || (this.accion === 'nuevo' && this.usuario.clave.trim() === "")) {
                    alertify.error("Por favor complete los campos obligatorios");
                    return;
                }

                let datos = {
                    idUsuario: this.accion == 'modificar' ? this.idUsuario : this.getId(),
                    usuario: this.usuario.usuario
                };

                if (this.usuario.clave.trim() !== "") {
                    datos.hash = sha256(this.usuario.clave).toString();
                } else if (this.accion == 'modificar') {
                    // Si estamos modificando y la clave está vacía, mantenemos la anterior
                    const actual = await db.usuarios.get(this.idUsuario);
                    datos.hash = actual.hash;
                }

                await db.usuarios.put(datos);
                this.limpiarFormulario();
                this.obtenerUsuarios();
                alertify.success(`Usuario ${datos.usuario} guardado correctamente`);
            } catch (error) {
                console.error(error);
                alertify.error("Error al guardar usuario");
            }
        },
        async obtenerUsuarios() {
            this.data_usuarios = await db.usuarios.toArray();
        },
        modificarUsuario(user) {
            this.accion = 'modificar';
            this.idUsuario = user.idUsuario;
            this.usuario.usuario = user.usuario;
            this.usuario.clave = ""; // Se deja en blanco para que solo se cambie si se escribe una nueva
        },
        async eliminarUsuario(id) {
            if (id === 1) {
                alertify.error("No se puede eliminar el usuario administrador principal");
                return;
            }
            alertify.confirm("Eliminar Usuario", "¿Está seguro de eliminar este usuario?",
                async () => {
                    await db.usuarios.delete(id);
                    this.obtenerUsuarios();
                    alertify.success("Usuario eliminado");
                }, () => { });
        },
        getId() {
            return new Date().getTime();
        },
        limpiarFormulario() {
            this.accion = 'nuevo';
            this.idUsuario = 0;
            this.usuario.usuario = '';
            this.usuario.clave = '';
        },
    },
    mounted() {
        this.obtenerUsuarios();
    },
    template: `
        <div class="row justify-content-center">
            <div class="col-md-5">
                <form id="frmUsuarios" @submit.prevent="guardarUsuario" @reset.prevent="limpiarFormulario">
                    <div class="card shadow border-0 rounded-3">
                        <div class="card-header bg-dark bg-gradient text-white py-3">
                            <h5 class="card-title mb-0 fw-bold">
                                <i class="bi bi-person-gear me-2"></i>GESTIÓN DE USUARIOS
                            </h5>
                        </div>
                        <div class="card-body p-4 bg-white">
                            <div class="mb-3">
                                <label class="form-label fw-semibold small text-secondary">USUARIO</label>
                                <input placeholder="Nombre de usuario" required v-model="usuario.usuario" type="text" class="form-control bg-light border-0 py-2">
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-semibold small text-secondary">
                                    {{ accion == 'nuevo' ? 'CONTRASEÑA' : 'NUEVA CONTRASEÑA (dejar en blanco para mantener)' }}
                                </label>
                                <input placeholder="********" :required="accion == 'nuevo'" v-model="usuario.clave" type="password" class="form-control bg-light border-0 py-2">
                            </div>
                        </div>
                        <div class="card-footer bg-light border-0 text-center py-3">
                            <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm me-2">
                                <i class="bi bi-floppy me-2"></i>GUARDAR
                            </button>
                            <button type="reset" class="btn btn-outline-secondary rounded-pill px-4 fw-bold">
                                <i class="bi bi-plus-lg me-2"></i>NUEVO
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-md-7">
                <div class="card shadow border-0 rounded-3">
                    <div class="card-header bg-success bg-gradient text-white py-3">
                        <h5 class="card-title mb-0 fw-bold">
                            <i class="bi bi-list-stars me-2"></i>LISTADO DE USUARIOS
                        </h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="py-3 px-4">Usuario</th>
                                        <th class="py-3 px-4 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="user in data_usuarios" :key="user.idUsuario">
                                        <td class="py-3 px-4">{{ user.usuario }}</td>
                                        <td class="py-3 px-4 text-center">
                                            <button @click="modificarUsuario(user)" class="btn btn-sm btn-outline-primary rounded-pill me-1">
                                                <i class="bi bi-pencil"></i>
                                            </button>
                                            <button @click="eliminarUsuario(user.idUsuario)" class="btn btn-sm btn-outline-danger rounded-pill">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};
