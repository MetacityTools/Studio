import { Metadata, Style } from "@editor/data/types";
import { useEditorContext } from "./useEditorContext";

export function useUpdateStyles() {
  const ctx = useEditorContext();

  const setStyle = (style?: Style, metadata?: Metadata) => {
    const s = style ?? ctx.styles;
    autoUpdateStyle(metadata ?? ctx.metadata, s);
    ctx.setStyles({ ...s });
  };

  return setStyle;
}

function autoUpdateStyle(metadata: Metadata, style: Style) {
  if (metadata.values) {
    const { scalars, categorical } = aggregateValues(metadata);

    if (scalars.size > 0) {
      updateScalarStyle(scalars, style);
    } else {
      if (style.style && style.style.scalars) delete style.style.scalars;
    }

    if (categorical.size > 0) {
      updateCategoricalStyle(categorical, style);
    } else {
      if (style.style && style.style.categories) delete style.style.categories;
      if (scalars.size === 0 && style.style) {
        delete style.style;
      }
    }
  } else {
    if (style.style) delete style.style;
  }

  if (metadata.children) {
    updateChildren(metadata.children, style);
  } else {
    if (style.children) delete style.children;
  }
}

function aggregateValues(metadata: Metadata) {
  const scalars = new Set<number>();
  const categorical = new Set<string>();

  if (!metadata.values) return { scalars, categorical };

  metadata.values.forEach((value) => {
    if (typeof value === "number") scalars.add(value);
    else if (typeof value === "string") categorical.add(value);
    else if (typeof value === "boolean") categorical.add(value.toString());
  });
  return { scalars, categorical };
}

//handle only case where scalars are present
function updateScalarStyle(scalars: Set<number>, style: Style) {
  if (!style.style) style.style = {};

  let min = Infinity;
  let max = -Infinity;

  scalars.forEach((value) => {
    if (value < min) min = value;
    if (value > max) max = value;
  });

  if (style.style?.scalars) {
    style.style.scalars.min = min;
    style.style.scalars.max = max;
  } else {
    style.style.scalars = {
      colormap: "plasma",
      min,
      max,
    };
  }
}

//handle only case where categories are present
function updateCategoricalStyle(categorical: Set<string>, style: Style) {
  if (!style.style) style.style = {};
  const catStyle = style.style.categories ?? {};

  categorical.forEach((value) => {
    if (!catStyle[value]) catStyle[value] = "#eeeeee"; //randomColor();
  });

  const categories = Object.keys(catStyle);

  for (let i = 0; i < categories.length; i++) {
    if (!categorical.has(categories[i])) {
      delete catStyle[categories[i]];
    }
  }

  style.style.categories = catStyle;
}

//handle only case where children are present
function updateChildren(children: Map<string, Metadata>, style: Style) {
  const childStyle = style.children ?? {};

  children.forEach((child, key) => {
    if (!childStyle[key]) childStyle[key] = {};
    autoUpdateStyle(child, childStyle[key]);
  });

  style.children = childStyle;
}
