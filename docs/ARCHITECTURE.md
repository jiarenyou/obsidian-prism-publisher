# Prism Publisher Architecture

## Overview

Prism Publisher uses a modular architecture with 5 core components:

## Components

### 1. Platform Adapters
Each platform (WeChat, Zhihu, etc.) implements the `PlatformAdapter` interface:
- `authenticate()`: OAuth login flow
- `publish()`: Publish content
- `update()`: Update published article
- `convertMarkdown()`: Platform-specific Markdown transformation

### 2. Auth Manager
- Manages OAuth tokens for all platforms
- Stores encrypted tokens in plugin data
- Auto-refreshes expired tokens

### 3. Frontmatter Manager
- Parses and updates YAML frontmatter
- Reads `publish_config` and `publish_status`
- Updates publication metadata

### 4. Settings Manager
- Loads/saves plugin settings
- Manages account credentials
- Maintains publish queue

### 5. Queue Manager
- Priority-based publishing queue
- Drag-and-drop reordering
- Batch publishing support

## Data Flow

1. User selects platforms in publish panel
2. Frontmatter Manager reads config
3. Content Converter transforms Markdown
4. Queue Manager schedules publications
5. Platform Adapters publish in priority order
6. Status Tracker updates Frontmatter

## Type Definitions

All types defined in `src/types/`:
- `platform.ts`: Platform adapter interfaces
- `publish.ts`: Publish config and status types
- `queue.ts`: Queue and settings types
