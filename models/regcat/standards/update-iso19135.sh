kurra file merge ~/work/iso/ontologies/HarmonizedOntology/outputs/ISO19135-1/*.ttl iso19135-metadata.ttl -d iso19135.1.ttl
kurra sparql iso19135.1.ttl add-to-iso19135.rq > iso19135.2.ttl
kurra sparql iso19135.2.ttl add-to-iso19135.2.rq > iso19135.ttl
rm iso19135.1.ttl
rm iso19135.2.ttl
