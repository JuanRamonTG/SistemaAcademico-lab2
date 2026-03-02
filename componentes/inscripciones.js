const inscripciones = {
    props: ['forms'],
    template: `
        <div class="row justify-content-center">
            <div class="col-md-10 col-lg-8">
                <form @submit.prevent="guardarInscripcion" @reset.prevent="limpiarFormulario">
                    <div class="card shadow border-0 rounded-3 overflow-hidden">
                        <div class="card-header bg-dark bg-gradient text-white py-3">
                            <h5 class="card-title mb-0 fw-bold">
                                <i class="bi bi-journal-plus me-2"></i>REGISTRO DE INSCRIPCIÓN
                            </h5>
                        </div>
                        <div class="card-body p-4 bg-white">
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label fw-semibold small text-secondary">ALUMNO</label>
                                    <v-select
                                        v-model="inscripcion.alumno"
                                        :options="alumnos"
                                        :get-option-label="a => a.nombre + ' (' + a.codigo + ')'"
                                        placeholder="-- Buscar alumno --"
                                        :clearable="false"
                                        class="v-select-custom shadow-sm rounded"
                                    ></v-select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-semibold small text-secondary">MATERIA</label>
                                    <select v-model="inscripcion.materia" class="form-select bg-light border-0 py-2" required>
                                        <option :value="null" disabled>-- Seleccione una materia --</option>
                                        <option v-for="m in materias" :key="m.idMateria" :value="m">
                                            {{ m.nombre }} ({{ m.codigo }})
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold small text-secondary">CICLO</label>
                                    <select v-model="inscripcion.ciclo" class="form-select bg-light border-0 py-2" required>
                                        <option value="" disabled>-- Seleccione ciclo --</option>
                                        <option value="Ciclo1">Ciclo 1</option>
                                        <option value="Ciclo2">Ciclo 2</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold small text-secondary">FECHA</label>
                                    <input required v-model="inscripcion.fecha" type="date" class="form-control bg-light border-0 py-2">
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
                                <button type="button" @click="buscarInscripcion" class="btn btn-outline-success rounded-pill px-4 fw-bold">
                                    <i class="bi bi-search me-2"></i>BUSCAR
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `,
    data() {
        return {
            alumnos: [],
            materias: [],
            inscripcion: {
                idInscripcion: 0,
                alumno: null,
                materia: null,
                ciclo: '',
                fecha: new Date().toISOString().substr(0, 10)
            },
            accion: 'nuevo'
        }
    },
    methods: {
        async cargarCatalogos() {
            this.alumnos = await db.alumnos.toArray();
            this.materias = await db.materias.toArray();
        },
        buscarInscripcion() {
            this.forms.busqueda_inscripciones.mostrar = !this.forms.busqueda_inscripciones.mostrar;
            this.$emit('buscar');
        },
        async guardarInscripcion() {
            try {
                if (!this.inscripcion.alumno || !this.inscripcion.materia) {
                    alertify.error("Seleccione alumno y materia");
                    return;
                }

                // VALIDACIÓN 1: ¿Está matriculado en este ciclo?
                const todasMatriculas = await db.matriculas.where('idAlumno').equals(this.inscripcion.alumno.idAlumno).toArray();
                const matriculado = todasMatriculas.find(m => m.ciclo.toLowerCase() === this.inscripcion.ciclo.toLowerCase());

                if (!matriculado) {
                    alertify.error(`El alumno no está matriculado en el ciclo ${this.inscripcion.ciclo}`);
                    return;
                }

                // VALIDACIÓN 2: ¿Ya está inscrito en otro ciclo activo?
                const todasInscripciones = await db.inscripciones.where('idAlumno').equals(this.inscripcion.alumno.idAlumno).toArray();

                if (this.accion === 'nuevo') {
                    const enOtroCiclo = todasInscripciones.find(
                        i => i.ciclo.toLowerCase() !== this.inscripcion.ciclo.toLowerCase()
                    );
                    if (enOtroCiclo) {
                        alertify.error(`${this.inscripcion.alumno.nombre} ya tiene inscripciones en ${enOtroCiclo.ciclo}. No puede estar en dos ciclos a la vez.`);
                        return;
                    }

                    // VALIDACIÓN 3: ¿Ya está inscrito en esta materia en este ciclo?
                    const materiaRepetida = todasInscripciones.find(
                        i => i.idMateria === this.inscripcion.materia.idMateria &&
                            i.ciclo.toLowerCase() === this.inscripcion.ciclo.toLowerCase()
                    );
                    if (materiaRepetida) {
                        alertify.error(`${this.inscripcion.alumno.nombre} ya está inscrito en ${this.inscripcion.materia.nombre} en este ciclo.`);
                        return;
                    }
                }

                const datos = {
                    idInscripcion: this.accion === 'modificar' ? this.inscripcion.idInscripcion : new Date().getTime(),
                    idAlumno: this.inscripcion.alumno.idAlumno,
                    nombreAlumno: this.inscripcion.alumno.nombre,
                    idMateria: this.inscripcion.materia.idMateria,
                    materiaNombre: this.inscripcion.materia.nombre,
                    ciclo: this.inscripcion.ciclo,
                    fecha: this.inscripcion.fecha
                };

                await db.inscripciones.put(datos);
                alertify.success("Inscripción exitosa");
                this.limpiarFormulario();
                this.$emit('buscar');
            } catch (e) {
                console.error(e);
                alertify.error("Error al procesar inscripción");
            }
        },
        limpiarFormulario() {
            this.inscripcion = {
                idInscripcion: 0,
                alumno: null,
                materia: null,
                ciclo: '',
                fecha: new Date().toISOString().substr(0, 10)
            };
            this.accion = 'nuevo';
        },
        async modificarInscripcion(d) {
            this.accion = 'modificar';
            this.inscripcion.idInscripcion = d.idInscripcion;
            this.inscripcion.ciclo = d.ciclo;
            this.inscripcion.fecha = d.fecha;
            this.inscripcion.alumno = await db.alumnos.get(d.idAlumno);
            this.inscripcion.materia = await db.materias.get(d.idMateria);
        }
    },
    mounted() {
        this.cargarCatalogos();
    },
    watch: {
        'forms.inscripciones.mostrar': function (newVal) {
            if (newVal) {
                this.cargarCatalogos();
            }
        }
    }
};
