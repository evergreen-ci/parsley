# {2023-07-18} Use GraphQL to Resolve Test Log URLs

- status: accepted
- date: 2023-07-18
- authors: Arjun Patel, Julian Edwards

## Context and Problem Statement

Parsley makes HTTP requests with test log URLs in order to render test logs in the application. Historically, test logs URLs are
resolved in Parsley by passing information available in the Parsley application URL into a string template. This mechanism could lead
to breaking changes when the test log URL structure is updated before the string template in Parsley. There should be a more reliable
way to resolve test log URLs in Parsley that requires fewer manual updates.

## Decision Outcome

The full test log URLs and rendering options are generated from Evergreen and available via the Task.tests GraphQL query, so
Parsley does not have to maintain URL templates.
