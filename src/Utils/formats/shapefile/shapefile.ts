const NULL = 0;
const POINT = 1;
const POLYLINE = 3;
const POLYGON = 5;
const MULTIPOINT = 8;
const POINTZ = 11;
const POLYLINEZ = 13;
const POLYGONZ = 15;
const MULTIPOINTZ = 18;
const POINTM = 21;
const POLYLINEM = 23;
const POLYGONM = 25;
const MULTIPOINTM = 28;
const MULTIPATCH = 31;

const SHAPETYPE_LOOKUP: Record<number, string> = {
    0: 'NULL',
    1: 'POINT',
    3: 'POLYLINE',
    5: 'POLYGON',
    8: 'MULTIPOINT',
    11: 'POINTZ',
    13: 'POLYLINEZ',
    15: 'POLYGONZ',
    18: 'MULTIPOINTZ',
    21: 'POINTM',
    23: 'POLYLINEM',
    25: 'POLYGONM',
    28: 'MULTIPOINTM',
    31: 'MULTIPATCH',
};

const TRIANGLE_STRIP = 0;
const TRIANGLE_FAN = 1;
const OUTER_RING = 2;
const INNER_RING = 3;
const FIRST_RING = 4;
const RING = 5;

const PARTTYPE_LOOKUP: Record<number, string> = {
    0: 'TRIANGLE_STRIP',
    1: 'TRIANGLE_FAN',
    2: 'OUTER_RING',
    3: 'INNER_RING',
    4: 'FIRST_RING',
    5: 'RING',
};

const MISSING = [null, ''];
const NODATA = -10e38; // as per the ESRI shapefile spec, only used for m-values.
