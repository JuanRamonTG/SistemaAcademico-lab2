const alumnos = {
    props: ['forms'],
    data() {
        return {
            alumno: {
                idAlumno: 0,
                codigo: "",
                nombre: "",
                direccion: "",
                email: "",
                telefono: ""
            },
            accion: 'nuevo',
            idAlumno: 0,
            data_alumnos: []
        }
    },
    methods: {
        buscarAlumno() {
            this.forms.busqueda_alumnos.mostrar = !this.forms.busqueda_alumnos.mostrar;
            this.$emit('buscar');
        },
        modificarAlumno(alumno) {
            this.accion = 'modificar';
            this.idAlumno = alumno.idAlumno;
            this.alumno.codigo = alumno.codigo;
            this.alumno.nombre = alumno.nombre;
            this.alumno.direccion = alumno.direccion;
            this.alumno.email = alumno.email;
            this.alumno.telefono = alumno.telefono;
        },
        async guardarAlumno() {
            try {
                // Generar hash basado en el código del alumno (usado como contraseña predeterminada '123')
                // El usuario pidió "hash de alumnos para encriptado de contraseña".
                // Dejaremos '123' como clave por defecto para que el usuario pueda loguearse.
                let datos = {
                    idAlumno: this.accion == 'modificar' ? this.idAlumno : this.getId(),
                    codigo: this.alumno.codigo,
                    nombre: this.alumno.nombre,
                    direccion: this.alumno.direccion,
                    email: this.alumno.email,
                    telefono: this.alumno.telefono,
                    hash: sha256('123').toString()
                };

                // Validar duplicidad de código
                const alumnosExistentes = await db.alumnos.where('codigo').equals(datos.codigo).toArray();
                if (alumnosExistentes.length > 0 && this.accion == 'nuevo') {
                    alertify.error(`El codigo ${datos.codigo} ya pertenece a ${alumnosExistentes[0].nombre}`);
                    return;
                }

                await db.alumnos.put(datos);
                this.limpiarFormulario();
                alertify.success(`${datos.nombre} guardado correctamente`);
            } catch (error) {
                console.error(error);
                alertify.error("Error al guardar alumno");
            }
        },
        getId() {
            return new Date().getTime();
        },
        limpiarFormulario() {
            this.accion = 'nuevo';
            this.idAlumno = 0;
            this.alumno.codigo = '';
            this.alumno.nombre = '';
            this.alumno.direccion = '';
            this.alumno.email = '';
            this.alumno.telefono = '';
        },
    },
    template: `
        <div class="row justify-content-center">
            <div class="col-md-10 col-lg-8">
                <form id="frmAlumnos" @submit.prevent="guardarAlumno" @reset.prevent="limpiarFormulario">
                    <div class="card shadow border-0 rounded-3 overflow-hidden">
                        <div class="card-header bg-dark bg-gradient text-white py-3">
                            <h5 class="card-title mb-0 fw-bold">
                                <i class="bi bi-person-plus-fill me-2"></i>REGISTRO DE ALUMNOS
                            </h5>
                        </div>
                        <div class="card-body p-4 bg-white">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label fw-semibold small text-secondary">CÓDIGO</label>
                                    <input placeholder="Ej: AL001" required v-model="alumno.codigo" type="text" class="form-control bg-light border-0 py-2">
                                </div>
                                <div class="col-md-8">
                                    <label class="form-label fw-semibold small text-secondary">NOMBRE COMPLETO</label>
                                    <input placeholder="Juan Pérez" required v-model="alumno.nombre" type="text" class="form-control bg-light border-0 py-2">
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-semibold small text-secondary">DIRECCIÓN</label>
                                    <input placeholder="Av. Principal #123" required v-model="alumno.direccion" type="text" class="form-control bg-light border-0 py-2">
                                </div>
                                <div class="col-md-7">
                                    <label class="form-label fw-semibold small text-secondary">EMAIL</label>
                                    <input placeholder="juan@ejemplo.com" required v-model="alumno.email" type="email" class="form-control bg-light border-0 py-2">
                                </div>
                                <div class="col-md-5">
                                    <label class="form-label fw-semibold small text-secondary">TELÉFONO</label>
                                    <input placeholder="7777-8888" required v-model="alumno.telefono" type="text" class="form-control bg-light border-0 py-2">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-light border-0 text-center py-3">
                            <div class="d-flex justify-content-center gap-2">
                                <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
                                    <i class="bi bi-floppy me-2"></i>GUARDAR
                                </button>
                                <button type="reset" class="btn btn-outline-secondary rounded-pill px-4 fw-bold">
                                    <i class="bi bi-plus-lg me-2"></i>NUEVO
                                </button>
                                <button type="button" @click="buscarAlumno" class="btn btn-outline-success rounded-pill px-4 fw-bold">
                                    <i class="bi bi-search me-2"></i>BUSCAR
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};