# AI Radar Discovery — Project Brief

## At a glance

| Field | Value |
|---|---|
| Portfolio area | Content operations |
| Repository | [jjshay/ai-radar-demo](https://github.com/jjshay/ai-radar-demo) |
| Status | Source available; runtime not revalidated in this documentation review |
| Evidence review | 2026-09-11; [commit 8c644bd](https://github.com/jjshay/ai-radar-demo/tree/8c644bdc680ca1518752fc71d1019132564c573e) |

## Problem and intended value

An operator needs to select worthwhile AI stories and turn selected stories into reusable content.

The intended value is a repeatable workflow whose inputs, transformations, and outputs can be inspected. Use the evidence below to distinguish implementation from business outcomes.

## Architecture and data flow

News provider proxies → swipe selection → AI scoring → Gamma generation → status polling.

```mermaid
flowchart LR
    N0["News provider proxies"]
    N1["swipe selection"]
    N2["AI scoring"]
    N3["Gamma generation"]
    N4["status polling"]
    N0 --> N1
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

## Implementation evidence

| Source | Reading purpose |
|---|---|
| [api/gamma.js](../api/gamma.js) | Implementation component supporting the data flow described above. |
| [api/gamma-status.js](../api/gamma-status.js) | Implementation component supporting the data flow described above. |
| [api/grok.js](../api/grok.js) | Implementation component supporting the data flow described above. |

The links above point to the current repository. The review reference identifies the version used to prepare this brief.

## Setup and operation

Use the existing [README](../README.md) for setup and operating commands. Configuration and dependency references: the source entry points and the existing README.

Start with sample or fixture inputs. Where external services are involved, configure a test account and check the distinction between a local preview, a generated artifact, and a remote write. Credentials and operational datasets are environment-specific.

## Validation and outcomes

**Review result:** Repository tree and referenced source reviewed. Existing application tests, hosted deployments, paid providers, and external mutations were not re-run in this documentation review.

No conventional test suite was identified in the reviewed repository tree; validation should begin with the next improvement below.

The source implements the workflow described above. No new revenue, accuracy, conversion, or production-uptime result is asserted by this documentation update.

Documentation itself is checked by `python3 scripts/check_project_docs.py`; that check validates this structure and its source references, not application behavior.

## Decisions and limitations

Thin serverless adapters keep the frontend small, while rate limits and asynchronous provider status remain part of the product contract.

Keep provider-dependent observations dated and separate from deterministic transformations. State which assumptions a demonstration uses and which integrations it actually exercises.

## Interview talking points

- **Problem and product judgment:** Explain why this workflow mattered to its intended operator: An operator needs to select worthwhile AI stories and turn selected stories into reusable content.
- **Technical walkthrough:** Trace one concrete input through this sequence: News provider proxies → swipe selection → AI scoring → Gamma generation → status polling.
- **Engineering tradeoff:** Thin serverless adapters keep the frontend small, while rate limits and asynchronous provider status remain part of the product contract.
- **Evidence and ownership:** Open the source links above, identify the specific design or implementation decisions you personally drove, and distinguish AI-assisted implementation from measured operating results.
- **What comes next:** Record a reproducible story-to-presentation walkthrough with provider failures and timeout behavior.

## Next improvements

Record a reproducible story-to-presentation walkthrough with provider failures and timeout behavior.

Record any follow-up result with a date, exact command or evaluation method, input scope, observed output, and limitations. Update `project.json` alongside this brief.

## Related projects

- [AI Radar Services](https://github.com/jjshay/ai-radar-backend) — Content operations.
- [AI Pulse Mobile](https://github.com/jjshay/ai-radar-mobile) — Content operations.
- [Art Catalog Automation](https://github.com/jjshay/art-catalog-automation) — Content operations.
- [Editorial Publishing Engine](https://github.com/jjshay/gauntlet-blog-engine) — Content operations.
- [Shopify Content Automation](https://github.com/jjshay/gauntlet-shopify-seed) — Content operations.

Some related repositories require authorized GitHub access.
