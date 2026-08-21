# Instrucciones locales del repositorio

## Ciclo de vida del entorno de desarrollo

- No dejar servidores de desarrollo ni infraestructura local ejecutándose en segundo plano al terminar una tarea.
- Si una tarea inicia los servicios del proyecto, antes de responder al usuario se debe detener el árbol de procesos completo de `pnpm`/`cross-env`/Next.js asociado a los puertos `3000` y `3001`; no basta con cerrar únicamente el proceso listener, porque el proceso padre puede reiniciarlo. Después, ejecutar `pnpm infra:down`.
- Conservar siempre los volúmenes de PostgreSQL al detener la infraestructura; no usar `docker compose down -v` salvo petición explícita del usuario.
- Solo dejar servicios o puertos activos cuando el usuario lo solicite expresamente.
