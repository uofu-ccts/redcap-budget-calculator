# API Naming, Path, and Parm Conventions

There are several ways of writing RESTful APIs. This document's purpose is to clarify the reasoning behind the choices made when writing the Budget Calculator APIs.

REDCap's APIs standardize on using only the verb POST and passing arguments to APIs as POST parameters instead of including them in the path as some APIs do. For consistency, we should do the same with the budget calculator.

REDCap's implementation of external modules constricts choices about path to endpoints. All endpoints are give a path compatible with REDCap's external modules.

```redcap/redcap_v<version number>/ExternalModules/?prefix=<module name>&page=api/<api name>```

Such as, ...

```http://2019augredcap:8888/redcap/redcap_v9.2.4/ExternalModules/?prefix=budget_calculator&page=api/echo```

Other conventions to follow:

* Do not use verbs in the API names. Only nouns.
* Use hyphens (-) to separate words for clarity in API names.
* All data returned to the client using the API will be in JSON format. If nessecary, Base-64 encoded.
* URIs are lowercase. No uppercase, snakecase, or camelcase URIs.