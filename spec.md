# Echo-Grid — Hyper-local Disaster Response Map

## Current State
New project. Empty backend and frontend scaffolding.

## Requested Changes (Diff)

### Add
- User authentication (login / register with name, phone, city)
- Dashboard with live incident heatmap using Leaflet.js (map of India centered on Delhi/Noida)
- Ability to report an incident: type (earthquake, flood, lightning, fire), severity, description, auto-captured live location
- Incident feed showing crowdsourced reports with location pins on map
- Heatmap overlay derived from incident density
- Do's & Don'ts section for each disaster type (earthquake, flood, lightning, fire) with illustrative images
- Live location capture via browser Geolocation API
- Role-based: regular user (report + view) and admin (view all, delete reports)
- Incident cards with timestamp, type badge, severity, reporter info

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Backend: User profiles (name, phone, city), incident reports (type, severity, lat/lng, description, timestamp, userId), CRUD for reports, admin role support via authorization component
2. Frontend: Auth screens (login/register), main dashboard with Leaflet map + heatmap, incident report modal, sidebar with recent reports, Do's & Don'ts page with disaster-type tabs and images, live location button
