# Geoprocessing Activities

The Activities here are characterized according to both the (dummy):

* Geoprocessing Activity Model
* Registry Catalogue Model

The Activities form a hierarchy based on `skos:vroader` relations that relate a specialized Activity to its more
generic parent. The hierarchy is:

```
Buffer

Cloud Removal

Waterbody Detection
├── Lake Detection
├── River Detection
│   ├── Rapid River Detection
│   └── Slow River Detection
└── Ice Detection

Dissolve
└── Dissolve Grasslands
```