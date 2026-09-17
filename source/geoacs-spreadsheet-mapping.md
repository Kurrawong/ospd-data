# Geoprocessing activity spreadsheet mapping

Source: [OSPD spreadsheet](https://docs.google.com/spreadsheets/d/1myNRKLghCCaTMaoFjfZjqK6D6MYFqtIn8lxUAIkXBjc/edit?usp=sharing), **Definitions Register** tab, read on 2026-09-17. The **README** tab provides the data dictionary.

The import contains the 33 populated definitions GA001–GA033. GA034–GA046 are preallocated IDs with no definition data and are not imported. The numeric row counter is not RDF data. CSV export combines group headings with `Name` and `Custodian Agent`; these are the name and custodian columns, respectively. The README calls the description field `Definition`.

## Namespaces

| Prefix | Namespace |
| --- | --- |
| demo | `http://ospd/demo/` |
| ex | `http://example.org/` |
| schema | `https://schema.org/` |
| skos | `http://www.w3.org/2004/02/skos/core#` |
| prov | `http://www.w3.org/ns/prov#` |
| istatus | `https://def.isotc211.org/codeset/ItemStatus/` |
| role | `https://def.isotc211.org/codeset/RoleCode/` |

## Column mappings

| Column | RDF mapping | Interpretation |
| --- | --- | --- |
| ID | Subject IRI | Append the exact, case-sensitive ID to `http://ospd/demo/`; e.g. `demo:GA001`. Each subject is an `ex:GeoprocessingActivity`. |
| Name | `schema:name` | Plain text literal, preserved verbatim. |
| Description | `schema:description` | Plain text literal, preserved verbatim, including source spelling. |
| Source of Defn | `schema:citation` | HTTP(S) URLs become IRIs; bibliographic text remains a literal. |
| Broader | `skos:broader` | Resolve names or IDs against imported definitions, including the parent activities GA030–GA033. |
| Related | `skos:related` | Split comma-separated names, trim separator whitespace, and resolve each name or ID. |
| Custodian Agent | `prov:qualifiedAttribution / prov:agent` | Attribution has `prov:hadRole role:custodian`. Resolve keywords through the Lookups tab to an IRI for `prov:agent`; retain unmatched labels as named blank nodes. |
| Contact Agent | `prov:qualifiedAttribution / prov:agent` | Attribution has `prov:hadRole role:pointOfContact`. |
| Container/System | `ex:qualifiedStatus / schema:memberOf` | Each status node has `schema:value istatus:experimental`. See membership rules below. |
| ID/URL | `schema:url` | HTTP(S) URLs become IRIs; a non-URL identifier would remain a literal. |
| Version | `schema:version` | Every activity file has the plain literal `schema:version "1"`, per the explicit user override, regardless of the spreadsheet Version value. |

`prod:hadRole` in the request is interpreted as `prov:hadRole`, the PROV property used by the existing catalogues. Attribution nodes and qualified status nodes are separate blank nodes. Empty optional cells produce no triple, with the explicit catalogue-membership rule below as the exception. No language tags are inferred.

## Catalogue and membership

`resources/geoacs/ospd/_cat.ttl` defines `demo:ospd-geoacs`, a `dcat:Catalog` named **Demo OSPD Register**. It belongs to `demo:geoacs` through an experimental qualified status, making it a peer of the Croatian, Euro and OGC catalogues. It uses the existing catalogue conventions: Kurrawong AI as author, version `2`, and OGC with the existing register-owner role. This catalogue metadata is adopted from the peer/parent catalogues, not inferred from blank activity cells.

`OSPD Demo Catalog` resolves to `http://ospd/demo/ospd-geoacs`. Every imported activity is explicitly a member of this new catalogue, including rows with a blank Container/System, so all imported definitions can be reached through its item listing. GA007 additionally retains its supplied external container, `https://ogcincubator.github.io/bblocks-stac/bblock/ogc.contrib.stac.extensions.mlm-ontology/ontology`, in a second experimental qualified status. The external membership does not replace membership in the new catalogue. Semicolon-separated Container/System values are split into separate memberships. GA021–GA028 additionally list `AI-DGGS FII workflow`, `ArcGIS`, `GRASS GIS`, and `GDAL`; GA029 lists `AI-DGGS workflow` and `OGC DGGS`. These names have no supplied IRIs and are preserved as separate blank nodes with `rdfs:label`, each referenced by an experimental qualified status.

One Turtle file per activity is named after its ID. The resource manifest includes `_cat.ttl` as CatalogueData and `GA*.ttl` as ResourceData with `schema:additionalType ex:GeoprocessingActivity`.

## Relationship resolution

| Source | Predicate | Target |
| --- | --- | --- |
| GA003 Envelope | broader | GA002 Boundary |
| GA003 Envelope | related | GA004 Bounding Circle |
| GA004 Bounding Circle | broader | GA002 Boundary |
| GA004 Bounding Circle | related | GA003 Envelope |
| GA005 Concave Hull | related | GA006 Convex Hull |
| GA006 Convex Hull | related | GA005 Concave Hull |
| GA009 ML Climate Variable Downscaling | related | Blank node labelled `STAC MLM` (unresolved) |
| GA012 SAVI | broader | GA008 Band Calculation |
| GA013 NDVI | broader | GA008 Band Calculation |
| GA016 Best available pixel (BAP) | related | GA014 Cloud cover, GA015 Cloud mask distance, GA012 SAVI, GA013 NDVI |
| GA017 Seasonal Sen’s Slope | related | GA016 Best available pixel (BAP) |

New relationships in GA021–GA029:

| Source | Broader (resolved ID) | Related |
| --- | --- | --- |
| GA021 | GA030 Terrain analysis | GA022, unresolved `Topographic Wetness Index calculation` |
| GA022 | GA031 Hydrological analysis | unresolved `Hydrological DEM conditioning`, GA023 |
| GA023 | GA031 Hydrological analysis | GA022, GA025, GA024 |
| GA024 | GA031 Hydrological analysis | GA022, GA023, GA025 |
| GA025 | GA031 Hydrological analysis | GA023, GA026, GA024 |
| GA026 | GA032 Raster analysis | GA025, GA028 |
| GA027 | GA032 Raster analysis | GA028, unresolved `Polygon-to-DGGS cell conversion` |
| GA028 | GA032 Raster analysis | GA027, GA026 |
| GA029 | GA033 Spatial indexing | GA027, GA028 |

GA030–GA033 are imported as named activities with catalogue membership; their descriptions are blank in the source and are omitted. Unresolved related names are retained as `rdfs:label` on blank nodes, using the same convention as `STAC MLM`. No identity is invented for these references. GA018–GA020 have no broader or related values.

`BAP` is treated as the acronym explicitly present in GA016's name. `STAC MLM` does not match a Name or ID and supplies no IRI; preserve it as an `rdfs:label` on a blank node rather than inventing an identity or another activity. No inverse, symmetric or transitive triples are materialized.

## Agents and unresolved identities

`OGC` resolves to the existing `https://defs.opengis.net/org/ogc` organization. Nicholas Car and Martin Pontius are represented by blank nodes with their supplied `schema:name`; no personal IRI is guessed. The email-valued contact `francis.charette-migneault@luqia.ca` is represented by a blank node with the original value as `schema:name` and a `schema:email` mailto IRI.

The custodian labels `STAC MLM?` (GA007, GA009) and `OGC API Processes?` (GA008) retain their question marks as `schema:name` on blank nodes. These are provisional source labels, not verified organizations. Blank nodes do not assert that repeated labels necessarily identify the same agent. Resolving these agents and the STAC MLM related resource requires additional source information. The literal custodian `?` in GA012–GA020 has no lookup entry and remains a named blank node. For the GA018–GA029 re-import, the Lookups entry `HARTIS` resolves to `https://hartis.org/`, used directly as `prov:agent` in GA021–GA029. Lookup keys are matched after trimming surrounding whitespace, and prefixed lookup IRIs are expanded using the declared namespaces. The Lookups entry for Martin Pontius is `demo:martin-pontius`; it is not applied to Contact Agent in this custodian-only update. GA020’s contact name retains its source trailing newline. GA012–GA017’s non-URL identifier `-` is retained as a literal `schema:url`. Their version is overridden to `"1"` as requested.

## Refresh and validation

Read the Definitions Register, README and Lookups tabs together on refresh. Preserve `schema:dateModified "2026-09-17"^^xsd:date` on all activity files (`xsd:` is `http://www.w3.org/2001/XMLSchema#`). Import rows with a nonempty Name, reject duplicate IDs, retain existing ID case and resolve relationships after collecting all populated rows. Do not emit empty placeholders or overwrite descriptions with corrected wording without a source change. Review new unresolved references explicitly.

Validation should parse all generated Turtle and the manifest, check the 33 expected subjects and their names/descriptions against the sheet, verify catalogue and activity memberships, verify role IRIs and attribution agents, and check all resolved relationships and manifest artifact paths. The data remains a snapshot of the cited sheet; later spreadsheet edits are not automatically synchronized.
