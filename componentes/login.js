const login = {
    props: ['forms'],
    template: `
        <div class="row justify-content-center align-items-center" style="min-height: 80vh;">
            <div class="col-md-5 col-lg-4">
                <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
                    <div class="card-header bg-dark bg-gradient text-white text-center py-4 border-0">
                        <i class="bi bi-shield-lock-fill fs-1 mb-2 d-block"></i>
                        <h4 class="mb-0 fw-bold">BIENVENIDO</h4>
                        <p class="small text-white-50 mb-0">Ingrese sus credenciales para continuar</p>
                    </div>
                    <div class="card-body p-4 p-lg-5 bg-white">
                        <form @submit.prevent="autenticar">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">USUARIO</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-0"><i class="bi bi-person-fill"></i></span>
                                    <input type="text" v-model="usuario" class="form-control bg-light border-0 py-2" placeholder="Código de alumno o admin" required>
                                </div>
                            </div>
                            <div class="mb-4">
                                <label class="form-label fw-semibold text-secondary small">CONTRASEÑA</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-0"><i class="bi bi-key-fill"></i></span>
                                    <input type="password" v-model="clave" class="form-control bg-light border-0 py-2" placeholder="********" required>
                                </div>
                            </div>
                            <div class="d-grid shadow-sm rounded-pill overflow-hidden">
                                <button type="submit" class="btn btn-dark py-2 fw-bold">
                                    <i class="bi bi-box-arrow-in-right me-2"></i> INGRESAR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <p class="text-center mt-4 text-secondary small">
                    &copy; 2026 Sistema Académico - Todos los derechos reservados
                </p>
            </div>
        </div>
    `,
    data() {
        return {
            usuario: '',
            clave: ''
        }
    },
    methods: {
        async autenticar() {
            try {
                const passHash = sha256(this.clave).toString();

                // 1. Intentar como Administrador (tabla usuarios)
                const admin = await db.usuarios.where('usuario').equals(this.usuario).first();
                if (admin && admin.clave === passHash) {
                    this.exito(admin.usuario);
                    return;
                }

                // 2. Intentar como Alumno (campo hash)
                // El usuario es el Código del alumno. El hash del alumno se compara con el hash de la clave ingresada.
                const alumno = await db.alumnos.where('codigo').equals(this.usuario).first();
                if (alumno && alumno.hash === passHash) {
                    this.exito(alumno.nombre);
                    return;
                }

                alertify.error("Credenciales incorrectas");
            } catch (error) {
                console.error(error);
                alertify.error("Error en la autenticación");
            }
        },
        exito(nombre) {
            this.$root.sesion.autenticado = true;
            this.$root.sesion.usuario = nombre;
            this.forms.login.mostrar = false;
            this.forms.alumnos.mostrar = true; // Abrir por defecto alumnos
            alertify.success(`Bienvenido ${nombre}`);
        }
    }
};
