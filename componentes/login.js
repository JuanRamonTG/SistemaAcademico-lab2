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
                            <div v-if="modo === 'registro'" class="row g-2">
                                <div class="col-12 mb-2">
                                    <label class="form-label fw-semibold text-secondary small">NOMBRE COMPLETO</label>
                                    <div class="input-group shadow-sm">
                                        <span class="input-group-text bg-light border-0"><i class="bi bi-person"></i></span>
                                        <input type="text" v-model="nombre" class="form-control bg-light border-0 py-2" placeholder="Juan Pérez" required>
                                    </div>
                                </div>
                                <div class="col-12 mb-2">
                                    <label class="form-label fw-semibold text-secondary small">DIRECCIÓN</label>
                                    <div class="input-group shadow-sm">
                                        <span class="input-group-text bg-light border-0"><i class="bi bi-geo-alt"></i></span>
                                        <input type="text" v-model="direccion" class="form-control bg-light border-0 py-2" placeholder="Av. Principal #123" required>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold text-secondary small">MUNICIPIO</label>
                                    <input type="text" v-model="municipio" class="form-control bg-light border-0 py-2 shadow-sm" placeholder="Municipio" required>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold text-secondary small">DEPARTAMENTO</label>
                                    <input type="text" v-model="departamento" class="form-control bg-light border-0 py-2 shadow-sm" placeholder="Dept." required>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold text-secondary small">TELÉFONO</label>
                                    <input type="text" v-model="telefono" class="form-control bg-light border-0 py-2 shadow-sm" placeholder="7777-8888" required>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold text-secondary small">SEXO</label>
                                    <select v-model="sexo" class="form-select bg-light border-0 py-2 shadow-sm" required>
                                        <option value="" disabled>...</option>
                                        <option value="M">M</option>
                                        <option value="F">F</option>
                                    </select>
                                </div>
                                <div class="col-12 mb-2">
                                    <label class="form-label fw-semibold text-secondary small">EMAIL</label>
                                    <div class="input-group shadow-sm">
                                        <span class="input-group-text bg-light border-0"><i class="bi bi-envelope"></i></span>
                                        <input type="email" v-model="email" class="form-control bg-light border-0 py-2" placeholder="juan@ejemplo.com" required>
                                    </div>
                                </div>
                                <div class="col-12 mb-2">
                                    <label class="form-label fw-semibold text-secondary small">FECHA NACIMIENTO</label>
                                    <input type="date" v-model="fechaNacimiento" class="form-control bg-light border-0 py-2 shadow-sm" required>
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
            direccion: '',
            municipio: '',
            departamento: '',
            telefono: '',
            fechaNacimiento: '',
            sexo: '',
            email: '',
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
            this.direccion = '';
            this.municipio = '';
            this.departamento = '';
            this.telefono = '';
            this.fechaNacimiento = '';
            this.sexo = '';
            this.email = '';
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

                    await db.usuarios.add({
                        idUsuario: existe.idAlumno,
                        usuario: this.usuario,
                        hash: sha256(this.clave).toString()
                    });
                    alertify.success("Contraseña asignada correctamente. Ya puede iniciar sesión.");
                } else {
                    const userPayload = {
                        idUsuario: new Date().getTime(),
                        usuario: this.usuario,
                        hash: sha256(this.clave).toString()
                    };

                    // Si no existe, lo creamos desde cero en ambas tablas
                    await db.alumnos.add({
                        idAlumno: userPayload.idUsuario,
                        codigo: this.usuario,
                        nombre: this.nombre,
                        direccion: this.direccion,
                        municipio: this.municipio,
                        departamento: this.departamento,
                        telefono: this.telefono,
                        fechaNacimiento: this.fechaNacimiento,
                        sexo: this.sexo,
                        email: this.email,
                        hash: userPayload.hash
                    });

                    await db.usuarios.add(userPayload);
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

                // Intentar autenticar contra la tabla centralizada de usuarios
                const user = await db.usuarios.where('usuario').equals(this.usuario).first();

                if (user && user.hash === passHash) {
                    // Si es exitoso, buscamos si tiene un perfil de alumno para el saludo
                    const alumno = await db.alumnos.where('codigo').equals(this.usuario).first();
                    const nombreMostrar = alumno ? alumno.nombre : user.usuario;
                    this.exito(nombreMostrar);
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
