# 🏡 Metacity Studio

![Screenshot](src/assets/splash/screen.png)

Metacity Studio is an online tool for integrating and visualizing spatial and tabular data.

## How does it work?

Open the app, upload your data, see what's there. That's it.

The application is front-end only, all the data processing is done in the browser.

It may seem crazy, mangling large datasets in the browser, computing geometry and on top of that, rendering it all in a 3D environment.

Only time will tell if this is a good idea.

## What formats can you load in?

Currently:

-   SHP (Polygons and MultiPatch only)
-   IFC
-   GLTF (triangles only)

## Roadmap

-   [x] Grid in the background
-   [x] Translucent models to see wirefame in the background
-   [x] Snap vertices
-   [x] Translation - scale - rotate
-   [x] Split models
-   [x] Hide models
-   [x] Delete model
-   [x] Loading SHP - _needs our own library to load, noone supports multipatch_
-   [x] BVH build into worker
-   [x] Loading screen + Add chicken
-   [x] Add React Context
-   [x] Tabs in sidepanel
-   [x] Redesign
-   [x] Sidepanel view settings
-   [x] Intro screen
-   [x] Selecting alignment for loaded models
-   [x] Worker pool for loading
-   [x] Status - counter, update global loading status
-   [x] Reading metadata from IFC files - inspeciton of metadata?
-   [x] CI na githubu autodeploy
-   [x] Uniforms copy on model add
-   [x] Rotate Splash screen bug
-   [ ] Loading points and lines from SHP
-   [ ] Loading GeoJSON
-   [ ] Project export
-   [ ] Project import
-   [ ] Allow labeling geometry
-   [ ] delete selected submodel
-   [ ] merge submodels

### Backlog

-   [ ] IFC metadata loading (memory-efficiency???)
-   [ ] BVH
-   [ ] remesh models - intersection of triangles
-   [ ] delete submodel - _for now as (split + delete)_
-   [ ] frustum culling
-   [ ] rectangular select
