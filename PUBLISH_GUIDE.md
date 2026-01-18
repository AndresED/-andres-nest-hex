# Guía para Publicar nest-hex en npm

## Opción 1: Configurar 2FA con Security Key (Recomendado)

1. Ve a: https://www.npmjs.com/settings/andres30xed/tfa
2. Haz clic en "Add Security Key" o "Enable 2FA"
3. Sigue las instrucciones para configurar:
   - **Security Key física** (YubiKey, etc.)
   - **Método del navegador** (Touch ID, Windows Hello, Face ID)
   - **App de autenticación** (si está disponible)

4. Una vez configurado, intenta publicar:
   ```bash
   npm publish --access public
   ```

## Opción 2: Usar Token de Acceso Granular (Automation)

Si no puedes configurar 2FA ahora, puedes usar un token de acceso:

### Crear Token:

1. Ve a: https://www.npmjs.com/settings/andres30xed/access-tokens
2. Haz clic en "Generate New Token"
3. Selecciona tipo: **Automation** (para CI/CD y scripts)
4. Configura permisos:
   - ✅ Read and write packages
   - ✅ Publish packages
5. Copia el token generado (solo se muestra una vez)

### Configurar Token Localmente:

```bash
# Opción A: Configurar en .npmrc (recomendado para este proyecto)
echo "//registry.npmjs.org/:_authToken=TU_TOKEN_AQUI" > .npmrc
git add .npmrc
# IMPORTANTE: Agrega .npmrc al .gitignore para no subir el token

# Opción B: Configurar globalmente
npm config set //registry.npmjs.org/:_authToken TU_TOKEN_AQUI
```

### Publicar con Token:

```bash
npm publish --access public
```

## Opción 3: Verificar si el paquete ya existe

Si `nest-hex` ya existe y pertenece a otro usuario:

```bash
# Verificar si el paquete existe
npm view nest-hex

# Si existe, necesitarás:
# 1. Ser agregado como colaborador, O
# 2. Usar un nombre diferente (ej: nest-hex-cli, @andres30xed/nest-hex)
```

## Cambiar nombre del paquete (si es necesario)

Si necesitas cambiar el nombre:

1. Edita `package.json`:
   ```json
   {
     "name": "@andres30xed/nest-hex",
     ...
   }
   ```

2. O usa un nombre scoped:
   ```json
   {
     "name": "nest-hex-cli",
     ...
   }
   ```

## Verificar antes de publicar

```bash
# Ver qué se va a publicar
npm pack --dry-run

# Ver tu configuración
npm whoami
npm config get registry
```
