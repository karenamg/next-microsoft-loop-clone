import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Delimiter from "@editorjs/delimiter";
import Alert from "editorjs-alert";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import SimpleImage from "simple-image-editorjs";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
import Paragraph from "@editorjs/paragraph";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { db } from "@/config/firebaseConfig";
import { useState } from "react";

interface RichDocumentEditorProps {
  params: {
    workspaceid: string;
    documentid: string;
  };
}

function RichDocumentEditor({ params }: RichDocumentEditorProps) {
  const ref = useRef<EditorJS | undefined>(undefined);
  let editor: EditorJS | undefined;
  const initEditorCalled = useRef(false);
  const { user } = useUser();
  let isFetched = false;

  const saveDocument = () => {
    ref.current.save().then(async (outputData) => {
      const docRef = doc(db, "DocumentOutput", params?.documentid);

      console.log(outputData);
      await updateDoc(docRef, {
        output: JSON.stringify(outputData),
        editedBy: user?.primaryEmailAddress?.emailAddress,
      });
    });
  };

  const getDocumentOutput = () => {
    const unsubscribe = onSnapshot(
      doc(db, "DocumentOutput", params?.documentid),
      (doc) => {
        if (
          doc.data()?.editedBy != user?.primaryEmailAddress?.emailAddress ||
          isFetched == false
        )
          doc.data()?.editedBy &&
            editor?.render(JSON.parse(doc.data()?.output));
        isFetched = true;
      }
    );
  };

  useEffect(() => {
    params && getDocumentOutput();
  }, [params, getDocumentOutput]);

  const initEditor = () => {
    if (!initEditorCalled.current) {
      initEditorCalled.current = true;
      editor = new EditorJS({
        onChange: (api, event) => {
          console.log("UPDATED");
          saveDocument();
        },
        onReady: () => {
          getDocumentOutput();
        },
        holder: "editorjs",
        tools: {
          header: Header,
          delimiter: Delimiter,
          paragraph: Paragraph,
          alert: {
            class: Alert,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+A",
            config: {
              alertTypes: [
                "primary",
                "secondary",
                "info",
                "success",
                "warning",
                "danger",
                "light",
                "dark",
              ],
              defaultType: "primary",
              messagePlaceholder: "Enter something",
            },
          },
          table: Table,
          list: {
            class: List as any,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+L",
            config: {
              defaultStyle: "unordered",
            },
          },
          checklist: {
            class: Checklist,
            shortcut: "CMD+SHIFT+C",
            inlineToolbar: true,
          },
          image: SimpleImage,
          code: {
            class: CodeTool,
            shortcut: "CMD+SHIFT+P",
          },
        },
      });
      ref.current = editor;
    }
  };

  useEffect(() => {
    user && initEditor();
  }, [user, initEditor]);

  return (
    <div className="mx-40">
      <div id="editorjs"></div>
    </div>
  );
}

export default RichDocumentEditor;
