const materias = {
    props: ['forms'],
    data() {
        return {
            materia: {
                idMateria: 0,
                codigo: "",
                nombre: "",
                uv: '',
            },
            accion: 'nuevo',
            idMateria: 0,
            data_materias: []
        }
    },
    methods: {
        buscarMateria() {
            this.forms.busqueda_materias.mostrar = !this.forms.busqueda_materias.mostrar;
            this.$emit('buscar');
        },
        modificarMateria(materia) {
            this.accion = 'modificar';
            this.idMateria = materia.idMateria;
            this.materia.codigo = materia.codigo;
            this.materia.nombre = materia.nombre;
            this.materia.uv = materia.uv;
        },
        async guardarMateria() {
            let datos = {
                idMateria: this.accion == 'modificar' ? this.idMateria : this.getId(),
                codigo: this.materia.codigo,
                nombre: this.materia.nombre,
                uv: this.materia.uv,
            };
            this.buscar = datos.codigo;
            //await this.obtenerMaterias();

            if (this.data_materias.length > 0 && this.accion == 'nuevo') {
                alertify.error(`El codigo del materia ya existe, ${this.data_materias[0].nombre}`);
                return; //Termina la ejecucion de la funcion
            }
            db.materias.put(datos);
            this.limpiarFormulario();
            //this.obtenerMaterias();
            alertify.success(`Materia ${datos.nombre} guardada correctamente`);
        },
        getId() {
            return new Date().getTime();
        },
        limpiarFormulario() {
            this.accion = 'nuevo';
            this.idMateria = 0;
            this.materia.codigo = '';
            this.materia.nombre = '';
            this.materia.uv = '';
        },
    },
    template: `
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <form id="frmMaterias" @submit.prevent="guardarMateria" @reset.prevent="limpiarFormulario">
                    <div class="card shadow border-0 rounded-3 overflow-hidden">
                        <div class="card-header bg-dark bg-gradient text-white py-3">
                            <h5 class="card-title mb-0 fw-bold">
                                <i class="bi bi-book-half me-2"></i>REGISTRO DE MATERIAS
                            </h5>
                        </div>
                        <div class="card-body p-4 bg-white">
                            <div class="row g-3">
                                <div class="col-md-5">
                                    <label class="form-label fw-semibold small text-secondary">CÓDIGO</label>
                                    <input placeholder="MAT101" required v-model="materia.codigo" type="text" class="form-control bg-light border-0 py-2">
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label fw-semibold small text-secondary">NOMBRE DE LA MATERIA</label>
                                    <input placeholder="Matemática I" required v-model="materia.nombre" type="text" class="form-control bg-light border-0 py-2">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label fw-semibold small text-secondary">UNIDADES VALORATIVAS (UV)</label>
                                    <input placeholder="4" required v-model="materia.uv" type="number" class="form-control bg-light border-0 py-2" min="1" max="10">
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
                                <button type="button" @click="buscarMateria" class="btn btn-outline-success rounded-pill px-4 fw-bold">
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