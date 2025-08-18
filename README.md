# Documentación del Proyecto de Organización de Mesas

## Descripción General

Este proyecto es una aplicación web para la organización de mesas en eventos como bodas. Permite a los usuarios asignar invitados a diferentes mesas de manera interactiva y visual, facilitando la gestión de la distribución de los asientos.

## Estructura del Proyecto

El proyecto está compuesto principalmente por dos componentes React: `AsignacionMesas` y `MesaVisual`. A continuación, se detalla la funcionalidad y estructura de cada uno.

### Componentes

#### `AsignacionMesas`

Este es el componente principal que gestiona la lógica de la aplicación y la interfaz de usuario para la organización de mesas.

##### Importaciones

- **React y Hooks**: Se utilizan `useState` y `useEffect` para manejar el estado y los efectos secundarios.
- **React Beautiful DnD**: Para la funcionalidad de arrastrar y soltar.
- **MesaVisual**: Componente hijo para visualizar las mesas.
- **SCSS**: Estilos específicos para el componente.

##### Estados

- `invitadosData`: Almacena los datos de los invitados cargados desde un archivo JSON.
- `tables`: Lista de mesas disponibles.
- `searchTerm`: Término de búsqueda para filtrar invitados.
- `activeGroup`: Grupo activo en la lista de invitados.
- `selectedTable`: Mesa seleccionada actualmente.
- `selectedGuest`: Invitado seleccionado actualmente.
- `nuevaMesa`: Datos para crear una nueva mesa.
- `mostrarFormulario`: Controla la visibilidad del formulario para crear una nueva mesa.
- `filtroConfirmados`: Filtro para mostrar invitados confirmados, pendientes o todos.

##### Funcionalidades

- **Carga de Datos**: Utiliza `useEffect` para cargar los datos de invitados desde un archivo JSON al montar el componente.
- **Filtrado de Invitados**: Filtra invitados según el término de búsqueda y el estado de confirmación.
- **Arrastre y Soltar**: Permite arrastrar invitados a las mesas para asignar asientos.
- **Gestión de Mesas**: Permite agregar, eliminar y seleccionar mesas.
- **Asignación Automática**: Sugiere una organización automática de invitados en las mesas.
- **Exportación de Datos**: Exporta la distribución de mesas a un archivo de texto.

##### Estructura del Componente

- **Encabezado**: Muestra el título y controles para buscar invitados y crear nuevas mesas.
- **Formulario de Nueva Mesa**: Formulario para agregar una nueva mesa.
- **Filtro de Confirmación**: Filtra invitados según su estado de confirmación.
- **Estadísticas**: Muestra estadísticas sobre mesas, invitados asignados, capacidad y sin asignar.
- **Contenido Principal**: Dividido en dos secciones, una para la lista de invitados y otra para las mesas.
- **Pie de Página**: Contiene un botón para exportar la distribución de mesas.

#### `MesaVisual`

Este componente se encarga de visualizar una mesa y sus sillas, mostrando qué sillas están ocupadas y cuáles están vacías.

##### Props

- `mesa`: Datos de la mesa a mostrar.
- `onSillaClick`: Función para manejar el clic en una silla.
- `selectedGuest`: Invitado seleccionado actualmente.
- `isVip`: Indica si la mesa es VIP.

##### Funcionalidades

- **Visualización de Sillas**: Muestra sillas ocupadas y vacías alrededor de una mesa circular.
- **Posicionamiento Circular**: Las sillas se posicionan alrededor de la mesa en un círculo.
- **Estilo de Sillas**: Las sillas ocupadas y vacías tienen diferentes estilos visuales.

##### Estructura del Componente

- **Mesa Circular Central**: Representa la mesa.
- **Sillas**: Se renderizan alrededor de la mesa, con estilos diferentes para sillas ocupadas y vacías.

### Estilos

Los estilos están definidos en archivos SCSS, siguiendo una estrategia mobile-first con breakpoints en 768px (tablet) y 1024px (escritorio). Los estilos están optimizados para ser responsivos y consistentes con el diseño general del sitio.

## Instrucciones de Uso

1. **Cargar Datos**: La aplicación carga automáticamente los datos de invitados desde un archivo JSON al iniciar.
2. **Buscar Invitados**: Utiliza el campo de búsqueda para filtrar invitados por nombre.
3. **Crear Mesas**: Usa el botón "Nueva Mesa" para agregar mesas adicionales.
4. **Asignar Invitados**: Arrastra y suelta invitados desde la lista a las mesas para asignar asientos.
5. **Gestionar Mesas**: Selecciona una mesa para ver detalles y eliminar invitados de la mesa.
6. **Exportar Distribución**: Usa el botón "Exportar Distribución" para guardar la distribución actual de las mesas en un archivo de texto.

## Conclusión

Este proyecto proporciona una solución interactiva y visual para la organización de mesas en eventos, facilitando la gestión de invitados y la distribución de asientos de manera eficiente y amigable.