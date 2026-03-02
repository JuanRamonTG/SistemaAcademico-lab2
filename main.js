const { createApp } = Vue,
    Dexie = window.Dexie,
    db = new Dexie("db_academica"),
    sha256 = CryptoJS.SHA256;


const app = createApp({
    components: {
        alumnos,
        busqueda_alumnos,
        materias,
        busqueda_materias,
        docentes,
        busqueda_docentes,
        matriculas,
        busqueda_matriculas,
        inscripciones,
        busqueda_inscripciones,
        login,
        usuarios,
    },
    data() {
        return {
            sesion: {
                autenticado: false,
                usuario: null,
            },
            forms: {
                login: { mostrar: true },
                alumnos: { mostrar: false },
                busqueda_alumnos: { mostrar: false },
                materias: { mostrar: false },
                busqueda_materias: { mostrar: false },
                docentes: { mostrar: false },
                busqueda_docentes: { mostrar: false },
                matriculas: { mostrar: false },
                busqueda_matriculas: { mostrar: false },
                inscripciones: { mostrar: false },
                busqueda_inscripciones: { mostrar: false },
                usuarios: { mostrar: false }
            }
        }
    },
    methods: {
        buscar(ventana, metodo) {
            this.$refs[ventana][metodo]();
        },
        abrirVentana(ventana) {
            this.forms[ventana].mostrar = !this.forms[ventana].mostrar;
        },
        modificar(ventana, metodo, data) {
            this.$refs[ventana][metodo](data);
        }
    },
    mounted() {
        // eliminamos campo hash de alumnos porque ahora sólo se guarda en usuarios
        // y mantenemos hashDatos como marca de contenido.
        db.version(9).stores({
            "alumnos": "idAlumno, codigo, nombre, direccion, municipio, departamento, telefono, fechaNacimiento, sexo, hashDatos, email",
            "materias": "idMateria, codigo, nombre, uv",
            "docentes": "idDocente, codigo, nombre, direccion, email, telefono, escalafon",
            "matriculas": "idMatricula, idAlumno, fecha, ciclo",
            "inscripciones": "idInscripcion, idAlumno, idMateria, fecha, ciclo",
            "usuarios": "idUsuario, usuario, hash"
        }).upgrade(tx => {
            // rellenar hashDatos para registros existentes y eliminar hash de contraseña
            return tx.table('alumnos').toCollection().modify(alumno => {
                if (!alumno.hashDatos) {
                    const base = {
                        idAlumno: alumno.idAlumno,
                        codigo: alumno.codigo,
                        nombre: alumno.nombre,
                        direccion: alumno.direccion,
                        municipio: alumno.municipio,
                        departamento: alumno.departamento,
                        telefono: alumno.telefono,
                        fechaNacimiento: alumno.fechaNacimiento,
                        sexo: alumno.sexo,
                        email: alumno.email
                    };
                    alumno.hashDatos = sha256(JSON.stringify(base)).toString();
                }
                // eliminar campo hash porque ya no se usa en alumnos
                if (alumno.hash) {
                    delete alumno.hash;
                }
            });
        });

        // Los usuarios se gestionarán desde el componente de usuarios.
    }
});

// Registro GLOBAL del componente v-select (defensivo para v4 beta o v3)
const vSelectComponent = window.vSelect ||
    window.VueSelect?.default ||
    window.VueSelect ||
    window["vue-select"]?.default ||
    window["vue-select"];

if (vSelectComponent) {
    app.component('v-select', vSelectComponent);
} else {
    console.warn("v-select no se pudo cargar. Verifique la conexión al CDN.");
}
app.mount("#app");