const busqueda_matriculas = {
    props: ['forms'],
    template: `
        <div class="row justify-content-center mt-3">
            <div class="col-12">
                <div class="card shadow-sm border-0 rounded-3">
                    <div class="card-body p-0">
                        <div class="p-3 bg-light border-bottom">
                            <div class="input-group shadow-sm rounded-pill overflow-hidden">
                                <span class="input-group-text bg-white border-0"><i class="bi bi-search"></i></span>
                                <input autocomplete="off" type="text" v-model="buscar" @keyup="obtenerMatriculas" 
                                    placeholder="Buscar por alumno o ciclo..." class="form-control border-0 py-2">
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-dark bg-gradient">
                                    <tr>
                                        <th class="ps-3 border-0">ALUMNO</th>
                                        <th class="border-0">FECHA</th>
                                        <th class="border-0">CICLO</th>
                                        <th class="border-0 text-center">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="m in matrículas" :key="m.idMatricula" @click="modificar(m)" style="cursor: pointer;">
                                        <td class="ps-3 fw-bold text-primary">{{m.nombreAlumno}}</td>
                                        <td>{{m.fecha}}</td>
                                        <td><span class="badge bg-info text-dark">{{m.ciclo}}</span></td>
                                        <td class="text-center">
                                            <div class="btn-group shadow-sm rounded-pill overflow-hidden">
                                                <button @click.stop="modificar(m)" class="btn btn-outline-primary btn-sm px-3">
                                                    <i class="bi bi-pencil-square"></i>
                                                </button>
                                                <button @click.stop="eliminar(m.idMatricula)" class="btn btn-outline-danger btn-sm px-3">
                                                    <i class="bi bi-trash3-fill"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="matrículas.length === 0">
                                        <td colspan="4" class="text-center py-4 text-muted">
                                            <i class="bi bi-clipboard-x fs-2 d-block mb-2"></i>
                                            No se encontraron matrículas
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
            matrículas: []
        }
    },
    methods: {
        async obtenerMatriculas() {
            let data = await db.matriculas.toArray();
            this.matrículas = data.filter(m =>
                (m.nombreAlumno || "").toLowerCase().includes(this.buscar.toLowerCase()) ||
                (m.ciclo || "").toLowerCase().includes(this.buscar.toLowerCase())
            );
        },
        modificar(m) {
            this.$emit('modificar', m);
        },
        async eliminar(id) {
            alertify.confirm("Eliminar Matrícula", "¿Desea eliminar este registro?", async () => {
                await db.matriculas.delete(id);
                this.obtenerMatriculas();
                alertify.success("Registro eliminado");
            }, () => { });
        }
    },
    mounted() {
        this.obtenerMatriculas();
    }
};
