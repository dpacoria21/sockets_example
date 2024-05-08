
# Simple Chat

### Requisitos
 1. clonar el repositorio
 2. Tener nodejs instalado
 3. Tener docker desktop
 4. (*opcional*) TablePlus para visualizar la base de datos

### Como usar el programa en dev
 1. Crear una copia del ``` .env.template ``` y renombrarlo con ``` .env ```
 2. Poner los datos que te piden
 3. instalar dependencias ``` npm install ```
 4. Levantar la base de datos ``` docker compose up -d ```
 5. Correr las migraciones de Prisma ``` npx prisma migrate dev ```
 6. Correr el proyecto ``` npm run dev ``` 
 7. (obligatorio) Para colocar el seed del chat (por ahora solo es 1 chat) ir a una pagina de google chrome o postman y poner el siguiente metodo GET (http://localhost:4000/seed)