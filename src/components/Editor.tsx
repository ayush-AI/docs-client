import { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import { DeltaStatic } from "quill";
import { modules, formats } from "../utils/QuillConfig";
import "react-quill/dist/quill.snow.css";
import { Box } from "@mui/material";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import jsPDF from "jspdf";

function Editor() {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState<string>("");
  const [socket, setSocket] = useState<Socket>();
  const quillRef = useRef<ReactQuill>(null);
  const { id: documentId } = useParams();
  const makePdf = new jsPDF();

  useEffect(() => {
    const s = io(
      (import.meta.env.VITE_API_URL as string) || "http://localhost:5000",
      { transports: ["websocket"] }
    );
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    quillRef.current?.getEditor().disable();
    quillRef.current?.getEditor().setText("Loading...");
  }, []);

  useEffect(() => {
    if (socket == null || quillRef == null) return;
    socket.once("load-document", (document, title) => {
      quillRef.current?.getEditor().setContents(document);
      setTitle(title);
      quillRef.current?.getEditor().enable();
    });
    socket.emit("get-document", documentId);
  }, [socket, quillRef, documentId]);

  useEffect(() => {
    if (socket == null || quillRef == null) return;

    const handler = (delta: unknown, _oldDelta: unknown, source: unknown) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quillRef.current?.getEditor().on("text-change", handler);
    return () => {
      quillRef.current?.getEditor().off("text-change", handler);
    };
  }, [socket, quillRef]);

  useEffect(() => {
    if (socket == null || quillRef == null) return;

    const handler = (delta: DeltaStatic) => {
      quillRef.current?.getEditor().updateContents(delta);
    };
    socket.on("receive-changes", handler);
    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quillRef]);

  useEffect(() => {
    if (socket == null || quillRef == null) return;

    const titleHandler = (title: string) => {
      setTitle(title);
    };
    socket.on("recieve-title", titleHandler);
    return () => {
      socket.off("recieve-title", titleHandler);
    };
  }, [socket, quillRef]);

  useEffect(() => {
    if (socket == null || quillRef == null) return;
    const interval = setInterval(() => {
      socket.emit("save-document", quillRef.current?.getEditor().getContents());
    }, 2000);
    if (title.length > 0) {
      socket.emit("update-title", title);
    }
    return () => {
      clearInterval(interval);
    };
  }, [socket, quillRef, title]);

  const handlePrint = () => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const unprivilegedEditor =
        quillRef.current?.makeUnprivilegedEditor(editor);
      const content = unprivilegedEditor?.getHTML();
      makePdf.html(content as string, {
        callback: function (makePdf) {
          // For saving the PDF
          makePdf.save("test.pdf");
        },
        x: 15,
        y: 15,
        width: 170, // A4 width: 210
        windowWidth: 650,
      });
    }
  };

  return (
    <>
      <Box sx={{ height: "100vh", width: "100%", backgroundColor: "#f5f5f5" }}>
        <Navbar handlePrint={handlePrint} title={title} setTitle={setTitle} />
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          modules={modules}
          formats={formats}
          ref={quillRef}
        />
      </Box>
    </>
  );
}

export default Editor;
