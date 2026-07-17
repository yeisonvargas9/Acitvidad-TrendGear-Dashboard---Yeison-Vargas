
**Prompt:**

Necesito que me ayudes a crear un proyecto completo para un taller llamado "TrendGear Dashboard", que va desde crear datos de prueba hasta tener una página web funcionando con esos datos. Es una tienda de tecnología ficticia y necesito lo siguiente:

**Parte 1 – Los datos**

Quiero un dataset (una tabla de datos) inventado pero realista de 60 clientes, con estas 11 columnas exactamente: ID del cliente, Nombre, Email (usando el dominio mailinator.com para que sea seguro), Producto comprado, Fecha de compra, Monto gastado en dólares, Edad, Ciudad, Método de pago, Fecha del último inicio de sesión, y Nivel de membresía (Bronze, Silver, Gold, Platinum).

Antes de generarlo, valida que todo tenga sentido: que las edades estén entre 13 y 100 años, que los montos nunca sean negativos, que las fechas estén en formato año-mes-día y que ninguna sea futura, que la fecha de compra siempre sea antes o igual que la del último inicio de sesión, que no haya IDs ni correos repetidos, y que categorías como el método de pago estén escritas siempre igual (por ejemplo "Credit Card", no "credit card").

Quiero que generes esto con un script de Python (para que sea reproducible y pueda volver a generarlo cuando quiera), y que el resultado final me lo entregues en un archivo CSV.

**Parte 2 – La página web (el dashboard)**

Con esos datos ya validados, necesito que construyas una página web tipo panel/dashboard para visualizarlos. El código debe estar separado en archivos distintos: uno de HTML, uno de CSS y uno de JavaScript (no todo junto).

El diseño debe seguir estas reglas de marca:
- Fondo oscuro, color #1E1E1E
- Letra Roboto
- Color de acento azul, #007BFF, para botones y elementos destacados
- Un menú de navegación que en el celular se convierta en un menú tipo "hamburguesa" (las tres rayitas que se despliegan)
- La página debe tener una cabecera (header), un cuerpo principal y un pie de página (footer), y verse bien tanto en computadora como en celular

**Parte 3 – Conectar los datos a la web**

La parte de JavaScript debe traer los datos usando `fetch` (como si viniera de una base de datos en la nube, tipo Firebase Realtime Database) y luego recorrer cada registro con un bucle para ir armando tarjetas o filas dinámicamente y mostrarlas en la pantalla, en vez de tenerlas escritas a mano en el HTML.

Como no tengo un proyecto de Firebase real todavía, que el sistema funcione igual con un archivo de datos local mientras tanto, pero dejando muy claro y fácil el paso para más adelante conectarlo a un Firebase real de verdad (solo cambiando una parte del código, sin tener que rehacer todo).

**Parte 4 – Que funcione bien**

Antes de entregarme el proyecto, revisa que no tenga errores: que el JavaScript no tenga fallos de sintaxis, que todos los elementos que el JavaScript busca en la página realmente existan en el HTML, y que al abrir la página cargue los datos sin problemas. Explícame también en un archivo de instrucciones cómo debo abrir la página para que funcione (sé que a veces abrir el archivo HTML directamente con doble clic da error).

Entrégame todos los archivos organizados en carpetas, listos para descargar.
