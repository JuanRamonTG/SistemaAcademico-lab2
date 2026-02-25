const busqueda_materias = {
    data() {
        return {
            buscar: '',
            materias: []
        }
    },
    methods: {
        modificarMateria(materia) {
            this.$emit('modificar', materia);
        },
        async obtenerMaterias() {
            this.materias = await db.materias.orderBy('codigo').filter(
                materia => materia.codigo.toLowerCase().includes(this.buscar.toLowerCase())
                    || materia.nombre.toLowerCase().includes(this.buscar.toLowerCase())
            ).toArray();
        },
        async eliminarMateria(materia, e) {
            e.stopPropagation();
            alertify.confirm('Eliminar materias', `¿Está seguro de eliminar el materia ${materia.nombre}?`, async e => {
                await db.materias.delete(materia.idMateria);
                this.obtenerMaterias();
                alertify.success(`Materia ${materia.nombre} eliminada correctamente`);
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
                                <input autocomplete="off" type="search" @keyup="obtenerMaterias()" v-model="buscar" 
                                    placeholder="Buscar por nombre o código..." class="form-control border-0 py-2">
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0" id="tblMaterias">
                                <thead class="table-dark bg-gradient">
                                    <tr>
                                        <th class="ps-3 border-0">CÓDIGO</th>
                                        <th class="border-0">NOMBRE</th>
                                        <th class="border-0">UV</th>
                                        <th class="border-0 text-center">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="materia in materias" :key="materia.idMateria" @click="modificarMateria(materia)" style="cursor: pointer;">
                                        <td class="ps-3 fw-bold text-primary">{{ materia.codigo }}</td>
                                        <td>{{ materia.nombre }}</td>
                                        <td><span class="badge bg-info text-dark">{{ materia.uv }} UV</span></td>
                                        <td class="text-center">
                                            <button class="btn btn-outline-danger btn-sm rounded-pill px-3" @click="eliminarMateria(materia, $event)">
                                                <i class="bi bi-trash3-fill me-1"></i> Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                    <tr v-if="materias.length === 0">
                                        <td colspan="4" class="text-center py-4 text-muted">
                                            <i class="bi bi-book-fill fs-2 d-block mb-2"></i>
                                            No se encontraron materias
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