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
-   Metacity File Format (binary Studio export)

---

## Planned Releases

These features are planned for the future, and scheduled for a specific release.

### v0.5.3 - Work in progress

-   [ ] Major refactor of the codebase
-   [ ] Loading points and lines from SHP
-   [ ] Lock camera position (two buttons - pan and rotation) + locking height during panning as in map

### v0.5.2 - ✅ Released

-   [x] Export screenshot action
-   [x] Refactored Global context and processing status - https://github.com/MetacityTools/Studio/issues/33
-   [x] Projecting models onto models (2D onto 3D) - https://github.com/MetacityTools/geometry.ts
-   [x] Replace json style editor with something more user friendly
    -   [x] Add a way to add custom styles
    -   [x] Switching colormaps for scalars
    -   [x] Editable input for colors
-   [x] Feedback - show notifications on the bottom of the screen
-   [x] Tables - add notification on data assignment

### v0.5.1 - ✅ Released

GLTF loader now assumes Y+ as up axis (as in Blender) and converts the models to Z+ up axis. This is not a breaking change, but it is necessary to make the models compatible with the rest of the world.

-   [x] Dark mode
-   [x] Update import menu to allow importing multiple files at once, only separate models, tables, or reference planes
-   [x] FIX: glTF glitch composing transforms with parents insice scene graph
-   [x] FIX: coloring models when style changes - display live changes on save
-   [x] Color in table view according to metadata amount
    -   [x] Colorize model
    -   [x] Heatmap legendg
-   [x] Updated file extension (replacing .metacity with .mcmodel and .json.metactiy with .mcstyle), still supports the old extensions tho
-   [x] Tooltip on hover over model and labels in 3D
-   [x] FIX: Firefox handling mouse events for hover
-   [x] Refactor processing status - https://github.com/MetacityTools/Studio/issues/33
-   [x] Loading models based on param - base for https://github.com/MetacityTools/Studio/issues/22

### v0.5.0 - ✅ Released

⚠️ Breaking changes, old `.metacity` files will not be compatible.
🧠 Call for consultation (TB planned, end of July 2023)

-   [x] Remove groups and hierarchy - all models will be in a flat list
-   [x] Metadata editor replacing Hierarchy editor
    -   [x] Diffing metadata between models
    -   [x] Edit metadata on selection
    -   [x] Editor part 1 - allow editing common attributes
    -   ~~[ ] Editor part 2 - show which attributes are different (can be overwritten and changed to common)~~ - will not implement for now
    -   [x] fulltext search filtering - values only
-   [x] Styling
    -   [x] Style Editor
    -   [x] Auto generate/update styles
    -   [x] Style outline
    -   [x] Apply styles to the geometry
    -   [x] Styling UI - show data infographics
    -   [x] Clean syling button - switches on tab close
-   [x] Updated metadata format - binary buffers + attributes + styling
    -   [x] Metadata export/import
    -   [x] Styles
-   [x] Updated viewer to sync with studio
-   [x] Filter file inputs (add format filters)
-   [x] Click off model - deselect all
-   [x] Group selection in hierarchy tree optimization (shift to select, deselect previous on selectiong previous)
-   [x] When in Table view, click to select model and extend the selection based on groups on key/button/action
-   [x] Import and export data separated into models (do not join on export)
-   [x] Allow renaming models
-   [x] Refactor colors
-   [x] Resolve rejects during loading
-   [x] Allow colormap codes in styles instead of lists of colors [plasma, viridis, inferno, magma]

### v0.4.0 - ✅ Released

🧠 Call for consultation (TB planned, beginning of July 2023)

-   [x] Browsing metadata hierarchy in viewer
-   [x] Restructure menu in Editor (unify UI with viewer)
-   [x] Remove metadata view from transform view
-   [x] Display stats
-   [x] Styling based on data in hierarchy
-   [x] Move metadata layer styling up and down (in view controls)

### v0.3.2 - ✅ Released

-   [x] Viewer Base - making it the default view
-   [x] Loading models to viewer
-   [x] View Controls

### v0.3.1 - ✅ Released

-   [x] Bugfix in binary export

### v0.3.0 - ✅ Released

-   [x] Remove the conversion process and support switching between transform and table mode
    -   [x] add create/remove modifiers for hierarchy
    -   [x] move hierarchy to Editor Context
-   [x] Project export and import
    -   [x] Hierarchy - matadata convert
    -   [x] Join Models, serialize
    -   [x] Export
    -   [x] Import

### v0.2.1 - ✅ Released

-   [x] Auto setup shading based on height
-   [x] JSON metadata for nodes in hierarchy
    -   [x] Assign metadata to model nodes
-   [x] Resize guard update graphics (The "Oops" message is pretty lame)

🧠 Call for consultation

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
