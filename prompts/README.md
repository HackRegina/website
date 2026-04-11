# Prompts

Reusable prompts for recurring HackRegina tasks. These are designed to be pasted into AI tools (e.g. Copilot, ChatGPT) to speed up repetitive work.

## Available Prompts

### `update-canva-event-designs.prompt.md`

Used when new events are scheduled and the Canva social media designs need their dates/locations updated.

**When to use:** After finalizing the event calendar for an upcoming period (monthly, quarterly, etc.).

**How to use:**
1. Run `bun run create:events --dry-run` to preview the upcoming events list
2. Open the prompt file and copy its contents
3. Replace the `[paste URL]` placeholders with the actual Canva design share/edit links
4. Replace the example events list with the real upcoming events from the dry run output
5. Paste the completed prompt into an AI tool with Canva MCP/integration access

**Key details:**
- HackRegina runs three recurring event types: **Code Together**, **Lunch & Learn**, and **Battlesnake**
- **Beer & Code Together** is a variant of Code Together held at a different venue — both share the same Canva file (odd pages = Code Together, even pages = Beer & Code Together)
- Lunch & Learn has two page styles in Canva; use the simple **"Event"** style, not the "Title of Talk" variant
- Cultivator's address is **2375 College Ave** — some old templates have a typo (2735), so the prompt explicitly warns about this
- Each Canva file already has enough pages for the year — edits go on existing pages, no new pages needed
- All page edits within a single file should be done in one transaction to avoid partial updates
