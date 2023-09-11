import { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import { modules, formats } from '../utils/QuillConfig';
import 'react-quill/dist/quill.snow.css';
import { Box } from '@mui/material';
import { io, Socket } from 'socket.io-client';

function Editor() {
    const [value, setValue] = useState('');
    const [socket, setSocket] = useState<Socket>();
    const quillRef = useRef(null);
    

    useEffect(() => {
        const s = io('http://localhost:9000');
        setSocket(s);
        return () => {
            s.disconnect();
        }
    },[]);

    useEffect(() => {
        if(socket == null || quillRef == null) return;
        
        const handler = (delta: unknown, oldDelta: unknown, source: unknown) => {
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
        
        const handler = (delta: unknown) => {
            quillRef.current?.getEditor().updateContents(delta);
        }
        socket.on('receive-changes', handler);
        return () => {
            socket.off('receive-changes', handler);
        }
    },[socket, quillRef]);
    
    
  return (
    <Box sx={{ height: '100vh', width: '100%', backgroundColor: '#f5f5f5' }}>
    <ReactQuill theme="snow" value={value} onChange={setValue} modules={modules} formats={formats} ref={quillRef}/>
    </Box>
  )
}

export default Editor