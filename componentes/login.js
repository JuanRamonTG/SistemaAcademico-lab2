const login = {
    props: ['forms'],
    template: `
        <div class="row justify-content-center align-items-center" style="min-height: 80vh;">
            <div class="col-md-5 col-lg-4">
                <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
                    <div class="card-header bg-dark bg-gradient text-white text-center py-4 border-0">
                        <i class="bi" :class="modo === 'login' ? 'bi-shield-lock-fill' : 'bi-person-plus-fill'"></i>
                        <i class="bi fs-1 mb-2 d-block" :class="modo === 'login' ? 'bi-shield-lock-fill' : 'bi-person-plus-fill'"></i>
                        <h4 class="mb-0 fw-bold">{{ modo === 'login' ? 'BIENVENIDO' : 'REGISTRO' }}</h4>
                        <p class="small text-white-50 mb-0">
                            {{ modo === 'login' ? 'Ingrese sus credenciales para continuar' : 'Cree su cuenta de alumno' }}
                        </p>
                    </div>
                    <div class="card-body p-4 p-lg-5 bg-white">
                        <form @submit.prevent="modo === 'login' ? autenticar() : registrar()">
                            <div v-if="modo === 'registro'" class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">NOMBRE COMPLETO</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-0"><i class="bi bi-person"></i></span>
                                    <input type="text" v-model="nombre" class="form-control bg-light border-0 py-2" placeholder="Juan Pérez" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">USUARIO (CÓDIGO)</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-0"><i class="bi bi-person-fill"></i></span>
                                    <input type="text" v-model="usuario" class="form-control bg-light border-0 py-2" :placeholder="modo === 'login' ? 'Código o admin' : 'Ej: AL001'" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">CONTRASEÑA</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-0"><i class="bi bi-key-fill"></i></span>
                                    <input type="password" v-model="clave" class="form-control bg-light border-0 py-2" placeholder="********" required>
                                </div>
                            </div>
                            <div v-if="modo === 'registro'" class="mb-4">
                                <label class="form-label fw-semibold text-secondary small">CONFIRMAR CONTRASEÑA</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-0"><i class="bi bi-key"></i></span>
                                    <input type="password" v-model="confirmarClave" class="form-control bg-light border-0 py-2" placeholder="********" required>
                                </div>
                            </div>
                            <div class="d-grid shadow-sm rounded-pill overflow-hidden mb-3">
                                <button type="submit" class="btn btn-dark py-2 fw-bold">
                                    <i class="bi me-2" :class="modo === 'login' ? 'bi-box-arrow-in-right' : 'bi-check-circle-fill'"></i>
                                    {{ modo === 'login' ? 'INGRESAR' : 'REGISTRARME' }}
                                </button>
                            </div>
                            <div class="text-center">
                                <a href="#" @click.prevent="toggleModo" class="text-decoration-none small fw-bold text-primary">
                                    {{ modo === 'login' ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión' }}
                                </a>
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
            modo: 'login', // 'login' o 'registro'
            nombre: '',
            usuario: '',
            clave: '',
            confirmarClave: ''
        }
    },
    methods: {
        toggleModo() {
            this.modo = this.modo === 'login' ? 'registro' : 'login';
            this.usuario = '';
            this.clave = '';
            this.nombre = '';
            this.confirmarClave = '';
        },
        async registrar() {
            if (this.clave !== this.confirmarClave) {
                alertify.error("Las contraseñas no coinciden");
                return;
            }
            try {
                const existe = await db.alumnos.where('codigo').equals(this.usuario).first();

                if (existe) {
                    // Si ya tiene un hash, significa que ya tiene contraseña
                    if (existe.hash && existe.hash.trim() !== "") {
                        alertify.error("Este código de alumno ya tiene una cuenta activa.");
                        return;
                    }

                    // Si existe pero no tiene hash, lo actualizamos (asignamos contraseña)
                    await db.alumnos.update(existe.idAlumno, {
                        nombre: this.nombre,
                        hash: sha256(this.clave).toString()
                    });
                    alertify.success("Contraseña asignada correctamente. Ya puede iniciar sesión.");
                } else {
                    // Si no existe, lo creamos desde cero
                    await db.alumnos.add({
                        idAlumno: new Date().getTime(),
                        codigo: this.usuario,
                        nombre: this.nombre,
                        direccion: '',
                        email: '',
                        telefono: '',
                        hash: sha256(this.clave).toString()
                    });
                    alertify.success("Registro exitoso. Ahora puede iniciar sesión.");
                }

                this.toggleModo();
            } catch (error) {
                console.error(error);
                alertify.error("Error al registrar");
            }
        },
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
            this.forms.alumnos.mostrar = true;
            alertify.success(`Bienvenido ${nombre}`);
        }
    }
};
