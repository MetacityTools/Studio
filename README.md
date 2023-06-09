# 🏡 [Metacity Studio](https://studio.metacity.cc)

![Screenshot](./studio.png)

Metacity Studio is an online tool for integrating and visualization of spatial data.

Running at [studio.metacity.cc](https://studio.metacity.cc)

## How does it work?

Prepare urban visualizations online. Load your data, align it, and export it for viewing online.

-   works best with small to medium-sized datasets
-   allows yout to connect 3D models and metadata

## What formats can you load in?

Currently:

-   SHP (Polygons and MultiPatch only for now)
-   IFC
-   GLTF (triangles only)

## Roadmap

The project is in active development. The roadmap is as follows:

### v0.4.0

-   [ ] Optional interactivity - build BVH only if user opts-in to make the loaded models clickable
-   [ ] Hide and show models
-   [ ] Viewer - Details TBA

### v0.3.1

-   [ ] Loading points and lines from SHP
-   [ ] Extract Utils to separate SDK form metacity editors

### v0.3.2 - 👨‍💻 In progress

-   [ ] Remove the conversion process and support switching between transform and table mode
    -    [ ] add model identifiers
    -    [ ] add create/remove modifiers for hierarchy 
    -    [ ] move hierarchy to Editor Context 
-   [ ] Projecting models onto models (2D onto 3D) - ✨WIP https://github.com/vojtatom/geometry
-   [ ] Project export
-   [ ] Styling???

### v0.2.1 - ✅ Released

-   [x] Auto setup shading based on height
-   [x] JSON metadata for nodes in hierarchy
    -   [x] Assign metadata to model nodes
-   [x] Resize guard update graphics (The "Oops" message is pretty lame)

### v0.2.0 - ✅ Released

-   [x] Infrastructure for the built-in viewer (vite setup, etc.)
-   [x] Building a hierarchy of models (floors, buildings, blocks, etc.) - ✨WIP
    -   [x] Deselect all - button and shortcut
    -   [x] Group models
    -   [x] Group groups
    -   [x] Delete groups
    -   [x] Move groups (and models)
-   [x] View settings in the annotate settings - move it to the canvas
-   [x] Loading tabular data (CSV) and linking it to the hierarchy.
    -   [x] Loading CSV
    -   [x] CSV editor
    -   [x] Multiple CSVs
    -   [x] Linking CSV rows to the hierarchy
    -   [x] Unlinking CSV rows from the hierarchy
-   [x] Resolve table editing issues - maybe leave out table editing all togheter?
-   [x] Privacy Policy docs
-   [x] Add text to the Convert dialog

### v0.1.0 - ✅ Released

-   [x] Rectangular select
-   [x] Merge submodels
-   [x] Delete selected submodel
-   [x] Context Help

### v0.0.4 - ✅ Released

-   [x] Removed IFC metadata loading to optimize memory usage

### v0.0.3 - ✅ Released

-   [x] Selecting alignment for loaded models
-   [x] Worker pool for loading
-   [x] Status - counter, update global loading status
-   [x] Reading metadata from IFC files - inspeciton of metadata?
-   [x] CI na githubu autodeploy
-   [x] Uniforms copy on model add
-   [x] Rotate Splash screen bug

### v0.0.2 - ✅ Released

-   [x] Loading SHP - _needs our own library to load, noone supports multipatch_
-   [x] BVH build into worker
-   [x] Loading screen + Add chicken
-   [x] Add React Context
-   [x] Tabs in sidepanel
-   [x] Redesign
-   [x] Sidepanel view settings
-   [x] Intro screen

### v0.0.1 - ✅ Released

-   [x] Grid in the background
-   [x] Translucent models to see wirefame in the background
-   [x] Snap vertices
-   [x] Translation - scale - rotate
-   [x] Split models
-   [x] Hide models
-   [x] Delete model

## Backlog

-   [ ] Merge whole models
-   [ ] Loading GeoJSON
-   [ ] Loading IFC metadata loading (memory-efficiency???)
-   [ ] Remesh models - intersection of triangles
-   [ ] Frustum culling
