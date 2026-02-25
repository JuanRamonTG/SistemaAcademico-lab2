const busqueda_inscripciones = {
    props: ['forms'],
    template: `
        <div class="row justify-content-center mt-3">
            <div class="col-12">
                <div class="card shadow-sm border-0 rounded-3">
                    <div class="card-body p-0">
                        <div class="p-3 bg-light border-bottom">
                            <div class="input-group shadow-sm rounded-pill overflow-hidden">
                                <span class="input-group-text bg-white border-0"><i class="bi bi-search"></i></span>
                                <input autocomplete="off" type="text" v-model="buscar" @keyup="obtenerInscripciones" 
                                    placeholder="Buscar por alumno o materia..." class="form-control border-0 py-2">
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-dark bg-gradient">
                                    <tr>
                                        <th class="ps-3 border-0">ALUMNO</th>
                                        <th class="border-0">MATERIA</th>
                                        <th class="border-0 text-center">CICLO</th>
                                        <th class="border-0">FECHA</th>
                                        <th class="border-0 text-center">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="i in listado" :key="i.idInscripcion" @click="modificar(i)" style="cursor: pointer;">
                                        <td class="ps-3 fw-bold text-primary">{{i.nombreAlumno}}</td>
                                        <td>{{i.materiaNombre}}</td>
                                        <td class="text-center"><span class="badge bg-info text-dark">{{i.ciclo}}</span></td>
                                        <td>{{i.fecha}}</td>
                                        <td class="text-center">
                                            <div class="btn-group shadow-sm rounded-pill overflow-hidden">
                                                <button @click.stop="modificar(i)" class="btn btn-outline-primary btn-sm px-3">
                                                    <i class="bi bi-pencil-square"></i>
                                                </button>
                                                <button @click.stop="eliminar(i.idInscripcion)" class="btn btn-outline-danger btn-sm px-3">
                                                    <i class="bi bi-trash3-fill"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="listado.length === 0">
                                        <td colspan="5" class="text-center py-4 text-muted">
                                            <i class="bi bi-journal-x fs-2 d-block mb-2"></i>
                                            No se encontraron inscripciones
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            buscar: '',
            listado: []
        }
    },
    methods: {
        async obtenerInscripciones() {
            let data = await db.inscripciones.toArray();
            this.listado = data.filter(i =>
                (i.nombreAlumno || "").toLowerCase().includes(this.buscar.toLowerCase()) ||
                (i.materiaNombre || "").toLowerCase().includes(this.buscar.toLowerCase())
            );
        },
        modificar(i) {
            this.$emit('modificar', i);
        },
        async eliminar(id) {
            alertify.confirm("Eliminar Inscripción", "¿Seguro?", async () => {
                await db.inscripciones.delete(id);
                this.obtenerInscripciones();
                alertify.success("Eliminado");
            }, () => { });
        }
    },
    mounted() {
        this.obtenerInscripciones();
    }
};
