# Roadmap: Internacionalización (EN/ES)

## Fase 1: Infraestructura de I18n

### 1.1 Configurar Rails I18n
**Archivo:** `config/application.rb`
```ruby
config.i18n.available_locales = [:en, :es]
config.i18n.default_locale = :en
config.i18n.fallbacks = true
```

### 1.2 Detección de idioma en ApplicationController
**Archivo:** `app/controllers/application_controller.rb`
- Agregar `before_action :set_locale`
- Prioridad de detección:
  1. `session[:locale]` (preferencia guardada)
  2. `request.env['HTTP_ACCEPT_LANGUAGE']` (header del navegador)
  3. Fallback a `:en`
- Agregar acción `POST /locale` para cambiar idioma manualmente

### 1.3 Selector de idioma en UI
- Agregar dropdown en navbar/header
- Endpoint para cambiar `session[:locale]`
- Si usuario autenticado, persistir en `user.language_preference`

---

## Fase 2: Archivos de Locale

### 2.1 Crear `config/locales/es.yml`
Traducir ~85-100 cadenas identificadas:
- Screen reader labels (~45)
- Títulos de página (~15)
- Placeholders de formularios (~10)
- Confirmaciones (4)
- Flash messages (1)
- Web share text (3)
- Misc UI (~20)

### 2.2 Completar `config/locales/en.yml`
Extraer todas las cadenas hardcodeadas del código a este archivo.

### 2.3 Estructura propuesta de keys
```yaml
es:
  shared:
    go_back: "Volver"
    save: "Guardar"
    cancel: "Cancelar"
    delete: "Eliminar"
    search: "Buscar"
    close: "Cerrar"
    sign_in: "Iniciar sesión"
    sign_out: "Cerrar sesión"
    editing_mode: "Modo de edición"
    fullscreen: "Pantalla completa"

  books:
    title: "Título del libro"
    subtitle: "Subtítulo"
    author: "Autor"
    create: "Crear libro"
    delete_confirm: "¿Estás seguro de eliminar este libro? Esta acción no se puede deshacer."
    settings: "Configuración del libro"
    people: "Personas"
    public: "Público"
    private: "Privado"

  pages:
    delete_confirm: "¿Estás seguro de eliminar esta página?"
    untitled: "Sin título"
    text_page: "Página de texto"
    picture_page: "Página de imagen"
    section_page: "Página de sección"
    add_page: "Agregar página"
    word_count:
      one: "%{count} palabra"
      other: "%{count} palabras"

  users:
    name: "Nombre"
    email: "Correo electrónico"
    password: "Contraseña"
    create_account: "Crear cuenta"
    transfer_session: "Comparte para que vuelvan a acceder a su cuenta"

  search:
    placeholder: "Buscar en este libro…"
    no_results: "Sin resultados"
    highlighted: "Resaltado:"

  footer:
    made_with: "Hecho con Writebook"

  activerecord:
    errors:
      messages:
        required: "es obligatorio"
        taken: "ya está en uso"
```

---

## Fase 3: Extracción de Texto en Vistas (73 archivos)

### 3.1 Categorías de texto a extraer

| Categoría | Cantidad | Patrón |
|---|---|---|
| Screen reader labels | ~45 | `<span class="for-screen-reader"><%= t "shared.go_back" %></span>` |
| Títulos de página | ~15 | `<% content_for :title, t("books.index.title") %>` |
| Placeholders | ~10 | `placeholder: t("search.placeholder")` |
| Confirmaciones | 4 | `data: { turbo_confirm: t("books.delete_confirm") }` |
| Botones | ~20 | `<%= t "shared.save" %>` |
| Flash messages | 1 | `flash[:alert] = t("errors.too_many_requests")` |

### 3.2 Archivos por prioridad

**Alta (más strings):**
1. `app/views/books/show.html.erb` — TOC, botones, labels
2. `app/views/leafables/show.html.erb` — Lectura, navegación
3. `app/views/layouts/application.html.erb` — Header, footer, search
4. `app/views/books/_form.html.erb` — Formulario de libro
5. `app/views/users/new.html.erb` — Registro

**Media:**
6. `app/views/sessions/new.html.erb` — Login
7. `app/views/users/profiles/edit.html.erb` — Perfil
8. `app/views/accounts/custom_styles/edit.html.erb` — CSS custom
9. `app/views/books/index.html.erb` — Lista de libros
10. `app/views/first_runs/show.html.erb` — Setup inicial

**Baja (pocos strings):**
11-73. Resto de partials y templates

### 3.3 Patrón de migración
```erb
<!-- ANTES -->
<span class="for-screen-reader">Go back</span>

<!-- DESPUÉS -->
<span class="for-screen-reader"><%= t "shared.go_back" %></span>
```

---

## Fase 4: Helpers y Controladores

### 4.1 Helpers
- `app/helpers/books_helper.rb` — `"Start reading"`, `"Previous:"`, `"Next:"`, `"Table of contents:"`
- `app/helpers/invitations_helper.rb` — `"QR Code"`
- `app/helpers/translations_helper.rb` — `"Translate"` (screen reader)
- `app/helpers/pages_helper.rb` — `pluralize` → `t("helpers.word", count: n)`

### 4.2 Controladores
- `app/controllers/pages_controller.rb` — `"Untitled"` como título default
- `app/controllers/sessions_controller.rb` — flash alert `"Too many requests or unauthorized."`

### 4.3 Modelos
- `app/models/first_run.rb` — `ACCOUNT_NAME = "Writebook"`
- `app/models/demo_content.rb` — `"The Writebook Manual"`

---

## Fase 5: Migrar TranslationsHelper

### 5.1 Decisión
El `TranslationsHelper` actual muestra traducciones de referencia en popovers (6 idiomas con banderas).

**Opción recomendada: Mantener como feature adicional**
- No interfiere con Rails i18n
- Útil como referencia visual multi-idioma
- Se puede desactivar con config si se desea

### 5.2 Integración
- El helper puede leer de `config/locales/*.yml` en lugar del hash hardcodeado
- O mantener ambos sistemas independientes

---

## Fase 6: Testing y QA

### 6.1 Verificaciones
- [ ] Todas las vistas renderizan correctamente en EN y ES
- [ ] Detección de `Accept-Language` funciona
- [ ] Selector de idioma persiste la preferencia
- [ ] No hay strings hardcodeadas restantes (`grep -r "for-screen-reader.*[A-Z]" app/views`)
- [ ] Pluralización funciona en ambos idiomas
- [ ] Fechas y números se formatean correctamente
- [ ] Content protection no interfiere con i18n

### 6.2 Tests a agregar
- Request specs para detección de locale
- View specs para traducciones
- Helper specs para pluralización

---

## Estimación

| Fase | Complejidad | Tiempo |
|---|---|---|
| 1. Infraestructura | Baja | 30 min |
| 2. Archivos de locale | Media | 2-3 hrs |
| 3. Vistas (73 archivos) | Alta | 4-6 hrs |
| 4. Helpers/Controllers | Baja | 30 min |
| 5. TranslationsHelper | Baja | 30 min |
| 6. Testing | Media | 1-2 hrs |
| **Total** | | **~8-12 hrs** |
