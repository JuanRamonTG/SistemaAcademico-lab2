const busqueda_alumnos = {
    data() {
        return {
            buscar: '',
            alumnos: []
        }
    },
    methods: {
        modificarAlumno(alumno) {
            this.$emit('modificar', alumno);
        },
        async obtenerAlumnos() {
            this.alumnos = await db.alumnos.filter(
                alumno => alumno.codigo.toLowerCase().includes(this.buscar.toLowerCase())
                    || alumno.nombre.toLowerCase().includes(this.buscar.toLowerCase())
            ).toArray();
        },
        async eliminarAlumno(alumno, e) {
            e.stopPropagation();
            alertify.confirm('Elimanar alumnos', `¿Está seguro de eliminar el alumno ${alumno.nombre}?`, async e => {
                await db.alumnos.delete(alumno.idAlumno);
                this.obtenerAlumnos();
                alertify.success(`Alumno ${alumno.nombre} eliminado correctamente`);
            }, () => {
                //No hacer nada
            });
        },
    },
    template: `
        <div class="row justify-content-center mt-3">
            <div class="col-12">
                <div class="card shadow-sm border-0 rounded-3">
                    <div class="card-body p-0">
                        <div class="p-3 bg-light border-bottom">
                            <div class="input-group shadow-sm rounded-pill overflow-hidden">
                                <span class="input-group-text bg-white border-0"><i class="bi bi-search"></i></span>
                                <input autocomplete="off" type="search" @keyup="obtenerAlumnos()" v-model="buscar" 
                                    placeholder="Buscar por nombre o código..." class="form-control border-0 py-2">
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0" id="tblAlumnos">
                                <thead class="table-dark bg-gradient">
                                    <tr>
                                        <th class="ps-3">CÓDIGO</th>
                                        <th>NOMBRE</th>
                                        <th>DIRECCIÓN</th>
                                        <th>EMAIL</th>
                                        <th>TELÉFONO</th>
                                        <th class="text-center">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="alumno in alumnos" :key="alumno.idAlumno" @click="modificarAlumno(alumno)" style="cursor: pointer;">
                                        <td class="ps-3 fw-bold text-primary">{{ alumno.codigo }}</td>
                                        <td>{{ alumno.nombre }}</td>
                                        <td>{{ alumno.direccion }}</td>
                                        <td><span class="badge bg-light text-dark border">{{ alumno.email }}</span></td>
                                        <td>{{ alumno.telefono }}</td>
                                        <td class="text-center">
                                            <button class="btn btn-outline-danger btn-sm rounded-pill px-3" @click="eliminarAlumno(alumno, $event)">
                                                <i class="bi bi-trash3-fill me-1"></i> Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                    <tr v-if="alumnos.length === 0">
                                        <td colspan="6" class="text-center py-4 text-muted">
                                            <i class="bi bi-inbox fs-2 d-block mb-2"></i>
                                            No se encontraron alumnos
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