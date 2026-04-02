# IMA Seedance 2.0 Video Generator Pages Design

## Goal

Add `ima-seedance2.0-video-generator` to the `ima-skills-pages` landing site so the skill is discoverable from:

- the dynamic skill cards on the homepage
- the static skill list in `index.html`
- the tutorial and case showcase entry points
- the `manage.html` skill showcase page

The page content should reflect the actual skill boundaries from the repository package and should not invent rendered examples or media assets that do not exist yet.

## Scope

This change covers:

- adding one new public skill entry to the bilingual homepage data
- extending the skill-card renderer so installable skills can also show tutorial and case links
- adding one tutorial page under `demos/`
- registering the skill in the manage showcase tool group
- exposing four workflow-oriented case links from `manage.html`

This change does not cover:

- adding real generated video assets
- embedding hosted videos
- building a CMS or data ingestion pipeline from skill repositories
- redesigning the site layout

## Content Source

The new site content should be derived from:

- `ima-seedance2.0-video-generator/SKILL.md`
- `ima-seedance2.0-video-generator/clawhub.json`

The page copy should stay aligned with the documented capability set:

- quality-first `ima-pro`
- speed-first `ima-pro-fast`
- text-to-video
- image-to-video
- first-last-frame transition
- reference-media video generation with image, video, and audio reference inputs

## Information Architecture

### Homepage Dynamic Skill Card

Add a new skill object in both `zh` and `en` i18n skill lists.

The card should show:

- skill name
- category tag
- short capability summary
- model summary
- GitHub install button
- GitHub repository link
- tutorial link
- case showcase link

Unlike current behavior, tutorial and case links must be available for installable skills, not only `comingSoon` skills.

### Homepage Static Skill List

Add a static HTML list item in `index.html` for crawler and no-JS extraction.

The list item should include:

- skill display name
- GitHub repository URL
- `git clone` command
- tutorial page link
- case showcase page link

### Tutorial Page

Create `demos/ima-seedance2-video-generator-tutorial.html`.

The tutorial page acts as both:

- an overview page for the skill
- a workflow index for the case showcase

The page should include:

#### Intro

- skill name
- short bilingual summary
- model positioning for `ima-pro` and `ima-pro-fast`

#### Why Teams Choose It

- cinematic quality and temporal consistency
- camera language control
- multimodal reference support
- suitable scenarios such as ads, product demos, short films, and social clips

#### Recommended Inputs

- prompt
- model choice
- input images when relevant
- reference image, video, and audio when relevant
- requirement reminder for `IMA_API_KEY`

#### Workflow Sections

Provide four anchorable workflow sections:

- `#text-to-video`
- `#image-to-video`
- `#first-last-frame`
- `#reference-media`

Each section should describe:

- when to use it
- minimum useful inputs
- recommended model choice
- expected result

#### Install and Call

Include:

- GitHub repository URL
- `git clone` command
- reminder that the runtime needs `IMA_API_KEY`, `python3`, `ffmpeg`, and `ffprobe`

#### Scope Boundary

Explicitly state that the page documents workflows and usage entry points, not finished public showcase videos.

### Manage Showcase

Register the skill in `assets/js/manage-showcase.mjs` under the `tool` group.

Expose workflow links in `CASES_MAP`:

- tutorial overview page
- text-to-video anchor
- image-to-video anchor
- first-last-frame anchor
- reference-media anchor

This keeps the manage page useful without requiring separate case assets.

## Rendering Change

Update `assets/js/main.js` so installable skills can render optional tutorial and case links in addition to the existing GitHub actions.

Expected behavior:

- `comingSoon` skills keep their current join-group flow
- installable skills continue to show copy-install and GitHub buttons
- if `tutorialUrl` exists, show a tutorial link
- if `caseUrl` exists, show a case showcase link

The change should be additive and not break existing cards.

## Testing

Follow TDD for behavior changes.

Minimum verification:

- add or update tests for showcase section building so the new skill and case links normalize correctly
- run the relevant node tests
- verify homepage static content contains the new skill entry
- verify `manage.html` can resolve the new showcase links

## Risks

- changing skill-card rendering could unintentionally affect all existing cards
- adding tutorial and case links to installable cards could create layout overflow if styles are too narrow
- bilingual copy drift between `zh` and `en`

## Mitigations

- keep renderer changes minimal and backward compatible
- reuse current action styles instead of introducing a new action layout
- derive all messaging from the existing skill package metadata

## Implementation Outline

1. Add failing tests around showcase grouping and case link exposure if needed.
2. Update bilingual skill data for the new skill.
3. Update card rendering logic for optional tutorial and case links on installable skills.
4. Update static homepage list.
5. Add the tutorial page.
6. Register the skill and workflow links in the manage showcase.
7. Run tests and link verification.
