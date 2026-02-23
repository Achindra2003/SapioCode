"use client";

import { useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";

interface MonacoEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  onKeystroke?: (event: KeyboardEvent) => void;
  onPaste?: () => void;
}

export default function MonacoEditor({
  language,
  value,
  onChange,
  onKeystroke,
  onPaste,
}: MonacoEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Track keystrokes via Monaco only (not document-level) to avoid double-counting
    editor.onKeyDown((e: any) => {
      if (onKeystroke) {
        const key = e.browserEvent?.key || e.code || "Unknown";
        onKeystroke(new KeyboardEvent("keydown", { key }));
      }
    });

    // Track paste events via Monaco only
    editor.onDidPaste(() => {
      if (onPaste) {
        onPaste();
      }
    });
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={(v) => onChange(v || "")}
      onMount={handleEditorMount}
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: "JetBrains Mono, monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: "on",
        roundedSelection: true,
        automaticLayout: true,
        tabSize: 4,
        wordWrap: "on",
        padding: { top: 16, bottom: 16 },
      }}
    />
  );
}
