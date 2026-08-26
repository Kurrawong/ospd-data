## What is this?

This is a profile, which is "a specification that constrains, extends, combines, or provides guidance or 
explanation about the usage of other specifications", according to the W3C's 
[_Profiles Vocabulary_](https://www.w3.org/TR/dx-prof/). It is a profile of the well-known [Semantic Web]() catalogue 
vocabulary [DCAT](https://www.w3.org/TR/vocab-dcat/) and an [ISO](https://www.iso.org) standard for managing registered 
items, [ISO19135 - Geographic information - Procedures for item registration](https://www.iso.org/standard/54721.html).

The profile elements are constituted according to the Profiles Vocabulary's vocabulary.

This repository contains the source files for the human- and machine-readable versions of the profile and scripts to 
help the developers of it automate its creation and update.


## What is it for?

This profile is created for OGC in support of repeatable workflows. The OSPD project aims to allow organizations to 
record the provenance of workflows they have implemented and run which may have used remote data assets and 
externally-defined workflow element, such as geoprocessing activities. Those provenance records should allow others to
repeat the workflows, acquiring the remote data assets and other workflow elements, as needed. 

Since the workflows may use data and task definitions remote to the workflow executors, a system of federate registers
of data and task definitions - geoprocessing activities - will be needed to ensure repeatability.

This profile defines metadata for items in those federated registers that records enough information about their, their
statuses in the registers, their dependence on things in other registers and so on to allow for easy repeatability.

## Who is doing this?

This work is being undertaken by multiple members of the OSPD 2026 program with [KurrawongAI](https://kurrawong.ai) 
leading this profile definition.

## How can I use it?

You will be able to use this metadata profile to describe things in semantic data object catalogues and the catalogues
themselves. Documentation for this will be developed in later August 2026.