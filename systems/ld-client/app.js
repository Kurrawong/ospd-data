import { Parser, Store } from "n3";
import { QueryEngine } from "@comunica/query-sparql";

const UI_ENDPOINT = "http://localhost:3000/object";
const API_ENDPOINT = "http://localhost:8000/object";
const PROFILE = "exp:GeoAcGov";

const QUERY = `
PREFIX ex: <http://example.org/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX regrols: <https://def.isotc211.org/codeset/RegisterRolesDemo/>
PREFIX schema: <https://schema.org/>

SELECT ?a ?n
WHERE {
    ?g
        a ex:GeoprocessingActivity ;
        ex:qualifiedStatus [
            schema:memberOf [
                prov:qualifiedAttribution [
                    prov:agent ?a ;
                    prov:hadRole regrols:register-owner ;
                ] ;
            ] ;
        ] ;
    .
    ?a schema:name ?n .
}`;

const form = document.querySelector("#lookup-form");
const select = document.querySelector("#activity");
const button = form.querySelector("button");
const status = document.querySelector("#status");
const results = document.querySelector("#results");
const list = document.querySelector("#organisation-list");

function objectUrl(endpoint, iri) {
  const url = new URL(endpoint);
  url.searchParams.set("iri", iri);
  url.searchParams.set("_profile", PROFILE);
  url.searchParams.set("_mediatype", "text/turtle");
  return url;
}

async function requestRdf(iri) {
  const options = { headers: { Accept: "text/turtle" } };
  try {
    const uiResponse = await fetch(objectUrl(UI_ENDPOINT, iri), options);
    const uiType = uiResponse.headers.get("content-type") || "";

    if (uiResponse.ok && !uiType.includes("text/html")) {
      return uiResponse.text();
    }
  } catch {
    // The UI server does not enable cross-origin requests. Continue with the
    // Prez API endpoint that supplies the RDF used by that UI route.
  }

  const apiResponse = await fetch(objectUrl(API_ENDPOINT, iri), options);
  if (!apiResponse.ok) {
    throw new Error(`Prez returned HTTP ${apiResponse.status}.`);
  }
  return apiResponse.text();
}

async function findRegisterOwners(turtle) {
  const quads = new Parser({ format: "text/turtle" }).parse(turtle);
  const store = new Store(quads);
  const engine = new QueryEngine();
  const bindingsStream = await engine.queryBindings(QUERY, { sources: [store] });
  const organisations = [];

  for await (const bindings of bindingsStream) {
    organisations.push({
      iri: bindings.get("a").value,
      label: bindings.get("n").value,
    });
  }

  return organisations;
}

function renderOrganisations(organisations) {
  list.replaceChildren();

  for (const organisation of organisations) {
    const item = document.createElement("li");
    const name = document.createElement("strong");
    const link = document.createElement("a");
    name.textContent = organisation.label;
    link.href = organisation.iri;
    link.textContent = organisation.iri;
    link.target = "_blank";
    link.rel = "noreferrer";
    item.append(name, link);
    list.append(item);
  }

  results.hidden = false;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  button.disabled = true;
  results.hidden = true;
  list.replaceChildren();
  status.className = "status loading";
  status.textContent = "Requesting and querying RDF…";

  try {
    const turtle = await requestRdf(select.value);
    const organisations = await findRegisterOwners(turtle);

    if (organisations.length === 0) {
      status.className = "status empty";
      status.textContent = "No register-owning organisations were found.";
      return;
    }

    renderOrganisations(organisations);
    status.className = "status success";
    status.textContent = `${organisations.length} organisation${organisations.length === 1 ? "" : "s"} found.`;
  } catch (error) {
    console.error(error);
    status.className = "status error";
    status.textContent = `Unable to complete the lookup: ${error.message}`;
  } finally {
    button.disabled = false;
  }
});
