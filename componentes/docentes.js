const docentes = {
    props: ['forms'],
    data() {
        return {
            docente: {
                idDocente: 0,
                codigo: "",
                nombre: "",
                direccion: "",
                email: "",
                telefono: "",
                escalafon: ""
            },
            accion: 'nuevo',
            idDocente: 0,
            data_docentes: []
        }
    },
    methods: {
        buscarDocente() {
            this.forms.busqueda_docentes.mostrar = !this.forms.busqueda_docentes.mostrar;
            this.$emit('buscar');
        },
        modificarDocente(docente) {
            this.accion = 'modificar';
            this.idDocente = docente.idDocente;
            this.docente.codigo = docente.codigo;
            this.docente.nombre = docente.nombre;
            this.docente.direccion = docente.direccion;
            this.docente.email = docente.email;
            this.docente.telefono = docente.telefono;
            this.docente.escalafon = docente.escalafon;
        },
        async guardarDocente() {
            let datos = {
                idDocente: this.accion == 'modificar' ? this.idDocente : this.getId(),
                codigo: this.docente.codigo,
                nombre: this.docente.nombre,
                direccion: this.docente.direccion,
                email: this.docente.email,
                telefono: this.docente.telefono,
                escalafon: this.docente.escalafon
            };
            this.buscar = datos.codigo;
            //await this.obtenerDocentes();

            if (this.data_docentes.length > 0 && this.accion == 'nuevo') {
                alertify.error(`El codigo del docente ya existe, ${this.data_docentes[0].nombre}`);
                return; //Termina la ejecucion de la funcion
            }
            db.docentes.put(datos);
            this.limpiarFormulario();
            alertify.success(`${datos.nombre} guardado correctamente`);
            this.$emit('buscar');
        },
        getId() {
            return new Date().getTime();
        },
        limpiarFormulario() {
            this.accion = 'nuevo';
            this.idDocente = 0;
            this.docente.codigo = '';
            this.docente.nombre = '';
            this.docente.direccion = '';
            this.docente.email = '';
            this.docente.telefono = '';
            this.docente.escalafon = '';
        },
    },
    template: `
        <div class="row justify-content-center">
            <div class="col-md-10 col-lg-8">
                <form id="frmDocentes" @submit.prevent="guardarDocente" @reset.prevent="limpiarFormulario">
                    <div class="card shadow border-0 rounded-3 overflow-hidden">
                        <div class="card-header bg-dark bg-gradient text-white py-3">
                            <h5 class="card-title mb-0 fw-bold">
                                <i class="bi bi-person-workspace me-2"></i>REGISTRO DE DOCENTES
                            </h5>
                        </div>
                        <div class="card-body p-4 bg-white">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label fw-semibold small text-secondary">CÓDIGO</label>
                                    <input placeholder="Ej: DOC001" required v-model="docente.codigo" type="text" class="form-control bg-light border-0 py-2">
                                </div>
                                <div class="col-md-8">
                                    <label class="form-label fw-semibold small text-secondary">NOMBRE COMPLETO</label>
                                    <input placeholder="Dra. María García" required v-model="docente.nombre" type="text" class="form-control bg-light border-0 py-2">
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-semibold small text-secondary">DIRECCIÓN</label>
                                    <input placeholder="Av. Universitaria #456" required v-model="docente.direccion" type="text" class="form-control bg-light border-0 py-2">
                                </div>
                                <div class="col-md-7">
                                    <label class="form-label fw-semibold small text-secondary">EMAIL</label>
                                    <input placeholder="mgarcia@universidad.edu" required v-model="docente.email" type="email" class="form-control bg-light border-0 py-2">
                                </div>
                                <div class="col-md-5">
                                    <label class="form-label fw-semibold small text-secondary">TELÉFONO</label>
                                    <input placeholder="2222-3333" required v-model="docente.telefono" type="text" class="form-control bg-light border-0 py-2">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold small text-secondary">ESCALAFÓN</label>
                                    <select required v-model="docente.escalafon" class="form-select bg-light border-0 py-2">
                                        <option value="" disabled>-- Seleccione --</option>
                                        <option value="tecnico">Técnico</option>
                                        <option value="profesor">Profesor</option>
                                        <option value="ingeniero">Licenciado/Ingeniero</option>
                                        <option value="maestria">Maestría</option>
                                        <option value="doctor">Doctor</option>
                                    </select>
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
                                <button type="button" @click="buscarDocente" class="btn btn-outline-success rounded-pill px-4 fw-bold">
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