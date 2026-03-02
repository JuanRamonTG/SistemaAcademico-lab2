const matriculas = {
    props: ['forms'],
    template: `
        <div class="row justify-content-center">
            <div class="col-md-10 col-lg-8">
                <form id="frmMatriculas" @submit.prevent="guardarMatricula" @reset.prevent="limpiarFormulario">
                    <div class="card shadow border-0 rounded-3 overflow-hidden">
                        <div class="card-header bg-dark bg-gradient text-white py-3">
                            <h5 class="card-title mb-0 fw-bold">
                                <i class="bi bi-card-checklist me-2"></i>REGISTRO DE MATRICULA
                            </h5>
                        </div>
                        <div class="card-body p-4 bg-white">
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label fw-semibold small text-secondary">ALUMNO</label>
                                    <v-select
                                        v-model="matricula.alumno"
                                        :options="alumnos"
                                        :get-option-label="a => a.nombre + ' (' + a.codigo + ')'"
                                        placeholder="-- Buscar alumno --"
                                        :clearable="false"
                                        class="v-select-custom shadow-sm rounded"
                                    ></v-select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold small text-secondary">FECHA DE MATRICULA</label>
                                    <input required v-model="matricula.fecha" type="date" class="form-control bg-light border-0 py-2">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold small text-secondary">CICLO ACADÉMICO</label>
                                    <select v-model="matricula.ciclo" class="form-select bg-light border-0 py-2" required>
                                        <option value="" disabled>-- Seleccione ciclo --</option>
                                        <option value="Ciclo1">Ciclo 1</option>
                                        <option value="Ciclo2">Ciclo 2</option>
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
                                <button type="button" @click="buscarMatricula" class="btn btn-outline-success rounded-pill px-4 fw-bold">
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
            matricula: {
                idMatricula: 0,
                alumno: null,
                fecha: new Date().toISOString().substr(0, 10),
                ciclo: ''
            },
            accion: 'nuevo'
        }
    },
    methods: {
        async obtenerAlumnos() {
            this.alumnos = await db.alumnos.toArray();
        },
        buscarMatricula() {
            this.forms.busqueda_matriculas.mostrar = !this.forms.busqueda_matriculas.mostrar;
            this.$emit('buscar');
        },
        async guardarMatricula() {
            try {
                if (!this.matricula.alumno) {
                    alertify.error("Debe seleccionar un alumno");
                    return;
                }

                // Validar que el alumno no tenga ya una matrícula en cualquier ciclo
                const todasMatriculas = await db.matriculas.where('idAlumno').equals(this.matricula.alumno.idAlumno).toArray();
                const matriculaExistente = todasMatriculas.find(m =>
                    this.accion === 'nuevo'
                        ? true                                          // En nuevo: cualquier matrícula bloquea
                        : m.idMatricula !== this.matricula.idMatricula  // En modificar: excluir la propia
                );

                if (matriculaExistente) {
                    alertify.error("El alumno ya posee una matrícula activa. No puede matricularse en dos ciclos a la vez.");
                    return;
                }

                const datos = {
                    idMatricula: this.accion === 'modificar' ? this.matricula.idMatricula : new Date().getTime(),
                    idAlumno: this.matricula.alumno.idAlumno,
                    nombreAlumno: this.matricula.alumno.nombre,
                    fecha: this.matricula.fecha,
                    ciclo: this.matricula.ciclo
                };

                await db.matriculas.put(datos);
                alertify.success("Matrícula guardada correctamente");
                this.limpiarFormulario();
                this.$emit('buscar');
            } catch (e) {
                console.error(e);
                alertify.error("Error al guardar matrícula");
            }
        },
        limpiarFormulario() {
            this.matricula = {
                idMatricula: 0,
                alumno: null,
                fecha: new Date().toISOString().substr(0, 10),
                ciclo: ''
            };
            this.accion = 'nuevo';
        },
        async modificarMatricula(datos) {
            this.accion = 'modificar';
            this.matricula.idMatricula = datos.idMatricula;
            this.matricula.fecha = datos.fecha;
            this.matricula.ciclo = datos.ciclo;
            this.matricula.alumno = await db.alumnos.get(datos.idAlumno);
        }
    },
    mounted() {
        this.obtenerAlumnos();
    },
    watch: {
        'forms.matriculas.mostrar': function (newVal) {
            if (newVal) {
                this.obtenerAlumnos();
            }
        }
    }
};
