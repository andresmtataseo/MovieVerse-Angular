/**
 * Interfaces del dominio de películas
 *
 * Estas interfaces definen la estructura de datos que se usa
 * internamente en la aplicación, separada de la API externa
 */

/**
 * Interfaz principal para una película en la aplicación
 * Representa el modelo de dominio limpio, independiente de la API
 */
export interface Movie {
  id: number;           // Identificador único de la película
  title: string;        // Título de la película
  genres: number[];     // IDs de los géneros (referencia a Genre)
  rating: number;       // Calificación promedio (0-10)
  posterUrl: string;    // URL completa del poster
  year: number;         // Año de lanzamiento
  popularity: number;   // Índice de popularidad
  description: string;  // Sinopsis de la película

  // Propiedades opcionales para categorización
  isNewRelease?: boolean;   // Indica si es un estreno reciente
  isTrending?: boolean;     // Indica si está en tendencias
  isComingSoon?: boolean;   // Indica si próximamente
}

/**
 * Interfaz para actividades de usuario
 * Permite mostrar notificaciones de acciones de otros usuarios
 */
export interface UserActivity {
  id: number;           // Identificador único de la actividad
  userName: string;     // Nombre del usuario que realizó la acción
  userAvatar: string;   // URL del avatar del usuario
  action: string;       // Descripción de la acción realizada
  movieTitle?: string;  // Título de la película relacionada (opcional)
  timestamp: string;    // Fecha y hora de la actividad
}
