# Customer Portal Specification And Rollout Plan

## Product Goal

The product should have two clearly different experiences:

- A public website for discovery, trust building, and guided intake.
- A logged-in portal for customers, staff, and admins to operate real cases.

The public website keeps the marketing navigation. The logged-in product should not reuse the public navbar.

## Experience Shells

### Public Shell

- Used for home, procedures, destinations, courses, login, and register.
- Keeps the public navbar and footer.
- Focuses on information, trust, and lead qualification.

### Customer Shell

- Used after login for customers.
- Uses a sidebar, not the public navbar.
- Focuses on active journeys, enrolled courses, profile data, notifications, and next actions.

### Staff/Admin Shell

- Used by office employees.
- Uses its own sidebar and workbench-style pages.
- Focuses on case management, finance, customer records, and operational follow-up.

## Customer Information Architecture

### Stable Sidebar Areas

- Overview
- My Profile
- Notifications

### Dynamic Sidebar Areas

- My Journeys: one submenu item per active case
- My Courses: one submenu item per enrolled course

## Core Domain Model

The main customer-facing unit should be a journey or case, not a destination by itself.

Recommended shape:

- CustomerProfile
- Journey
- JourneyTask
- JourneyDocument
- JourneyUpdate
- CourseEnrollment
- StaffAssignment
- CommunicationLog
- AuditLog

### Journey Rule

One customer should have at most one active journey per destination and visa type pair. This prevents portal confusion and keeps each destination area focused.

## Customer Portal Pages

### Overview

- quick counts
- current journeys
- active courses
- unread notifications
- next actions

### My Profile

- identity and contact details
- reusable records shared across multiple journeys
- CVs and reusable supporting documents
- customer-owned data that admins can also update

### Journey Page

- destination and visa summary
- timeline and admin updates
- checklist and auditable tasks
- required documents
- payment status
- destination-specific reading and preparation notes

### Course Page

- course schedule
- level and language
- destination relevance
- enrollment status

## Staff And Permission Model

The current `admin` and `staff` split should evolve into permission-based work roles.

Suggested operational roles:

- super_admin
- case_manager
- finance_officer
- language_coach
- content_manager

Suggested permission areas:

- journeys.read
- journeys.update
- journeys.assign
- tasks.audit
- documents.audit
- finance.read
- finance.record
- customer.read
- customer.update
- content.edit
- staff.manage

## Low-Connectivity Design Rules

- Mobile-first authenticated portal
- No unnecessary polling
- Text-first pages over heavy visual widgets
- Aggressive form draft saving
- Compress uploads and support retries
- Keep customer pages task-oriented and short
- Use one clear next-action block on every journey page

## Automation Direction

Long term, email-connected agents can help update customer records and suggest next actions.

For now, all updates should be manual or human-approved. The data structures should still be designed so automated agents can later write into:

- communication logs
- journey updates
- checklist tasks
- document requests
- profile records

## Rollout Plan

### Phase 1

- Split public and logged-in shells
- Remove public navbar from customer and admin pages
- Add customer sidebar with dynamic journey and course items

### Phase 2

- Add proper profile page and reusable file vault
- Add dedicated customer course pages
- Tighten portal navigation around active journeys

### Phase 3

- Introduce journey tasks and audited checklists
- Introduce staff assignments and more granular permissions

### Phase 4

- Add communication log and internal office workflow support
- Prepare the system for mailbox-assisted automation and agent suggestions