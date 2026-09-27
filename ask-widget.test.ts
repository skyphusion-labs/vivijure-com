import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';

// public/ask-widget.js is a classic browser script (IIFE, no exports). These tests run the real
// file against a minimal scripted DOM and a scripted fetch body, and assert on what the widget
// puts in the answer element.

const src = readFileSync(new URL('./public/ask-widget.js', import.meta.url), 'utf8');

type El = Record<string, any>;

function makeDom() {
  const els: Record<string, El> = {
    '.vjask-form': { listeners: {} as Record<string, (ev: unknown) => void>, addEventListener(t: string, f: (ev: unknown) => void) { this.listeners[t] = f; } },
    '.vjask-input': { value: 'how do I render?', setAttribute() {} },
    '.vjask-label': { textContent: '' },
    '.vjask-btn': { disabled: false },
    '.vjask-answer': { textContent: '' },
    '.vjask-sources': { hidden: true, textContent: '', children: [] as El[], appendChild(n: El) { this.children.push(n); } },
  };
  const root = { classList: { add() {} }, innerHTML: '', querySelector: (s: string) => els[s] ?? null };
  const doc = {
    readyState: 'complete',
    currentScript: { getAttribute: () => null },
    querySelector: () => root,
    addEventListener() {},
    // the canonical widget builds source citations with the DOM API, not innerHTML
    createElement: () => ({ textContent: '', children: [] as El[], setAttribute() {}, appendChild(n: El) { this.children.push(n); } }),
    createTextNode: (t: string) => ({ textContent: t, children: [] as El[] }),
  };
  return { els, doc };
}

async function runWidget(chunks: string[]): Promise<{ answer: string; sources: string }> {
  const { els, doc } = makeDom();
  const enc = new TextEncoder();
  let i = 0;
  const fetchStub = async () => ({
    ok: true,
    body: {
      getReader: () => ({
        read: async () => (i < chunks.length ? { done: false, value: enc.encode(chunks[i++]) } : { done: true, value: undefined }),
      }),
    },
  });
  new Function('document', 'window', 'fetch', src)(doc, {}, fetchStub);
  els['.vjask-form'].listeners.submit({ preventDefault() {} });
  for (let n = 0; n < 200 && els['.vjask-btn'].disabled !== false; n++) await new Promise((r) => setTimeout(r, 5));
  // the submit handler sets disabled=true synchronously, so reaching false means finally ran
  expect(els['.vjask-btn'].disabled).toBe(false);
  const text = (n: El): string => (n.textContent ?? '') + (n.children ?? []).map(text).join('');
  return { answer: els['.vjask-answer'].textContent, sources: text(els['.vjask-sources']) };
}

const delta = (t: string) => `data: ${JSON.stringify({ choices: [{ delta: { content: t } }] })}\n\n`;

afterEach(() => {});

describe('ask widget stream handling', () => {
  it('renders streamed deltas and sources', async () => {
    const r = await runWidget([
      `event: chunks\ndata: ${JSON.stringify([{ item: { key: 'docs/a.md' } }])}\n\n`,
      delta('Hello '),
      delta('world'),
      'data: [DONE]\n\n',
    ]);
    expect(r.answer).toBe('Hello world');
    expect(r.sources).toContain('docs/a.md');
  });

  it('surfaces an "event: error" block instead of leaving the answer blank', async () => {
    const r = await runWidget([`event: error\ndata: ${JSON.stringify({ error: { message: 'model_overloaded' } })}\n\n`]);
    expect(r.answer).toContain('model_overloaded');
  });

  it('surfaces an error payload carried in a plain data event', async () => {
    const r = await runWidget([`data: ${JSON.stringify({ error: 'rate_limited' })}\n\n`]);
    expect(r.answer).toContain('rate_limited');
  });

  it('flushes a final event that has no trailing blank line', async () => {
    const r = await runWidget([delta('Hello '), `data: ${JSON.stringify({ choices: [{ delta: { content: 'tail' } }] })}`]);
    expect(r.answer).toBe('Hello tail');
  });

  it('joins multi-line data fields of one event before parsing', async () => {
    const r = await runWidget(['data: {"choices":[{"delta":{\ndata: "content":"multi"}}]}\n\n']);
    expect(r.answer).toBe('multi');
  });

  it('never leaves the answer blank when the stream ends with no content', async () => {
    const r = await runWidget(['data: [DONE]\n\n']);
    expect(r.answer).not.toBe('');
  });
});
