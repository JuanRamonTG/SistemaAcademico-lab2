const busqueda_docentes = {
    data() {
        return {
            buscar: '',
            docentes: []
        }
    },
    methods: {
        modificarDocente(docente) {
            this.$emit('modificar', docente);
        },
        async obtenerDocentes() {
            this.docentes = await db.docentes.filter(
                docente => docente.codigo.toLowerCase().includes(this.buscar.toLowerCase())
                    || docente.nombre.toLowerCase().includes(this.buscar.toLowerCase())
            ).toArray();
        },
        async eliminarDocente(docente, e) {
            e.stopPropagation();
            alertify.confirm('Elimanar docentes', `¿Está seguro de eliminar el docente ${docente.nombre}?`, async e => {
                await db.docentes.delete(docente.idDocente);
                this.obtenerDocentes();
                alertify.success(`Docente ${docente.nombre} eliminado correctamente`);
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
                                <input autocomplete="off" type="search" @keyup="obtenerDocentes()" v-model="buscar" 
                                    placeholder="Buscar por nombre o código..." class="form-control border-0 py-2">
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0" id="tblDocentes">
                                <thead class="table-dark bg-gradient">
                                    <tr>
                                        <th class="ps-3">CÓDIGO</th>
                                        <th>NOMBRE</th>
                                        <th>DIRECCIÓN</th>
                                        <th>EMAIL</th>
                                        <th>TELÉFONO</th>
                                        <th>ESCALAFÓN</th>
                                        <th class="text-center">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="docente in docentes" :key="docente.idDocente" @click="modificarDocente(docente)" style="cursor: pointer;">
                                        <td class="ps-3 fw-bold text-primary">{{ docente.codigo }}</td>
                                        <td>{{ docente.nombre }}</td>
                                        <td>{{ docente.direccion }}</td>
                                        <td><span class="badge bg-light text-dark border">{{ docente.email }}</span></td>
                                        <td>{{ docente.telefono }}</td>
                                        <td><span class="badge bg-info text-dark">{{ docente.escalafon }}</span></td>
                                        <td class="text-center">
                                            <button class="btn btn-outline-danger btn-sm rounded-pill px-3" @click="eliminarDocente(docente, $event)">
                                                <i class="bi bi-trash3-fill me-1"></i> Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                    <tr v-if="docentes.length === 0">
                                        <td colspan="7" class="text-center py-4 text-muted">
                                            <i class="bi bi-inbox fs-2 d-block mb-2"></i>
                                            No se encontraron docentes
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