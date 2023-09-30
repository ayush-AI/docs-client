import { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import { DeltaStatic } from 'quill';
import { modules, formats } from '../utils/QuillConfig';
import 'react-quill/dist/quill.snow.css';
import { Box } from '@mui/material';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';

function Editor() {
    const [value, setValue] = useState('');
    const [socket, setSocket] = useState<Socket>();
    const quillRef = useRef<ReactQuill>(null);
    const { id: documentId } = useParams();
    
    useEffect(() => {
        const s = io(import.meta.env.VITE_API_URL as string || 'http://localhost:5000', { transports: ['websocket'] });
        setSocket(s);
        return () => {
            s.disconnect();
        }
    },[]);

    useEffect(() => { 
        quillRef.current?.getEditor().disable();
        quillRef.current?.getEditor().setText('Loading...');
    },[]);

    useEffect(() => {
        if(socket == null || quillRef == null) return;
        socket.once('load-document', document => {
            quillRef.current?.getEditor().setContents(document);
            quillRef.current?.getEditor().enable();
        });
        socket.emit('get-document', documentId);
    },[socket, quillRef, documentId]);

    useEffect(() => {
        if(socket == null || quillRef == null) return;

        const handler = (delta: unknown, _oldDelta: unknown, source: unknown) => {
            if(source !== 'user') return;
            socket.emit('send-changes', delta);
        }
        quillRef.current?.getEditor().on('text-change', handler);
        return () => {
            quillRef.current?.getEditor().off('text-change', handler);
        }
    },[socket, quillRef]);

    useEffect(() => {
        if(socket == null || quillRef == null) return;
        
        const handler = (delta: DeltaStatic) => {
            quillRef.current?.getEditor().updateContents(delta);
        }
        socket.on('receive-changes', handler);
        return () => {
            socket.off('receive-changes', handler);
        }
    },[socket, quillRef]);

    useEffect(() => {
        if(socket == null || quillRef == null) return;
        
        const interval = setInterval(() => {
            socket.emit('save-document', quillRef.current?.getEditor().getContents());
        }, 2000);
        return () => {
            clearInterval(interval);
        }
    },[socket, quillRef]);
    
    
  return (
    <Box sx={{ height: '100vh', width: '100%', backgroundColor: '#f5f5f5' }}>
    <ReactQuill theme="snow" value={value} onChange={setValue} modules={modules} formats={formats} ref={quillRef}/>
    </Box>
  )
}

export default Editor