# Système de Mock Data

## Vue d'ensemble

Les données de mock sont centralisées dans `src/services/mockData.js` pour assurer la cohérence et faciliter la maintenance.

## Fichiers utilisant les mocks

### Pages Agent (Sécurité)
- **AppointmentValidation.jsx** - Utilise `MOCK_PENDING_APPOINTMENTS` (3 RDV en attente)
- **AgentDashboard.jsx** - Utilise `MOCK_TODAY_APPOINTMENTS` et `MOCK_ACTIVE_VISITS`
- **CurrentVisitors.jsx** - Utilise `MOCK_CURRENT_VISITORS`

### Pages Secrétaire
- **VisitsToday.jsx** - Utilise `MOCK_TODAY_APPOINTMENTS` (visites du jour)
- **ReportVisits.jsx** - Utilise `MOCK_REPORTS_VISITS` (rapport de visites)
- **ReportAppointments.jsx** - Utilise `MOCK_REPORTS_APPOINTMENTS` (rapport de RDV)

### Pages Admin
- **History.jsx** - Utilise `MOCK_HISTORY` (historique complet des visites)

## Structure des données

### MOCK_APPOINTMENTS
Données complètes d'un rendez-vous:
```javascript
{
  # Mock data — short note

  The canonical mock data lives in `src/services/mockData.js`.

  You can control whether mocks are enabled using the Vite environment variable `VITE_USE_MOCKS`.

  - To force mocks: set `VITE_USE_MOCKS=true` (in `.env`, `.env.development`, or CI env).
  - Defaults: mocks are enabled automatically in development mode (Vite's `import.meta.env.MODE === 'development'`).

  When mocks are disabled the exported MOCK_* constants become empty arrays/objects so components will not display mock content.

  See `src/services/mockData.js` for the full details.
```
