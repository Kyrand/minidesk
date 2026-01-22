<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
  import { commonmark } from '@milkdown/preset-commonmark';
  import { history } from '@milkdown/plugin-history';
  import { listener, listenerCtx } from '@milkdown/plugin-listener';

  interface Props {
    content: string;
    onChange: (content: string) => void;
  }

  let { content = '', onChange }: Props = $props();

  let editorElement: HTMLDivElement;
  let editor: Editor | null = $state(null);
  let isUpdatingFromProp = false;

  onMount(async () => {
    try {
      // Create and configure the editor
      const editorInstance = await Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, editorElement);
          ctx.set(defaultValueCtx, content);
          ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
            // Only trigger onChange if not updating from external prop
            if (!isUpdatingFromProp) {
              onChange(markdown);
            }
          });
        })
        .use(commonmark)
        .use(history)
        .use(listener)
        .create();

      editor = editorInstance;
    } catch (error) {
      console.error('Failed to initialize Milkdown editor:', error);
    }
  });

  // Update editor content when prop changes
  $effect(() => {
    if (editor && content !== undefined) {
      const currentContent = editor.action((ctx) => {
        return ctx.get(defaultValueCtx);
      });

      // Only update if content actually changed
      if (currentContent !== content) {
        isUpdatingFromProp = true;
        editor.action((ctx) => {
          ctx.set(defaultValueCtx, content);
        });
        // Reset flag after a short delay to allow the update to complete
        setTimeout(() => {
          isUpdatingFromProp = false;
        }, 0);
      }
    }
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>

<div
  bind:this={editorElement}
  class="milkdown-editor prose max-w-none p-4 min-h-[400px] focus:outline-none"
></div>

<style>
  :global(.milkdown-editor) {
    outline: none;
  }

  :global(.milkdown-editor .milkdown) {
    outline: none;
  }

  /* Basic editor styling */
  :global(.milkdown-editor h1) {
    font-size: 2em;
    font-weight: bold;
    margin-top: 0.67em;
    margin-bottom: 0.67em;
  }

  :global(.milkdown-editor h2) {
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 0.83em;
    margin-bottom: 0.83em;
  }

  :global(.milkdown-editor h3) {
    font-size: 1.17em;
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 1em;
  }

  :global(.milkdown-editor p) {
    margin-top: 1em;
    margin-bottom: 1em;
  }

  :global(.milkdown-editor ul),
  :global(.milkdown-editor ol) {
    margin-top: 1em;
    margin-bottom: 1em;
    padding-left: 2em;
  }

  :global(.milkdown-editor code) {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
  }

  :global(.milkdown-editor pre) {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
  }

  :global(.milkdown-editor blockquote) {
    border-left: 4px solid rgba(0, 0, 0, 0.2);
    padding-left: 1em;
    margin-left: 0;
    font-style: italic;
  }
</style>
