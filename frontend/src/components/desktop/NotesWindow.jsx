import React, { useState, useEffect } from 'react';
import AppWindow from './AppWindow';
import { fetchJson } from '../../api/client';

const NotesWindow = ({ onClose, isMaximized, onMinimize, onMaximize, zIndex, onFocus }) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        fetchJson('/api/features/notes')
            .then(data => setNotes(data.notes || []))
            .catch(console.error);
    }, []);

    const saveNote = () => {
        if (!newNote.trim()) return;
        setLoading(true);
        fetchJson('/api/features/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newNote })
        })
            .then(data => {
                setNotes([data, ...notes]);
                setNewNote('');
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    };

    const startEdit = (note) => {
        setEditingId(note.id);
        setEditContent(note.content);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditContent('');
    };

    const saveEdit = (id) => {
        if (!editContent.trim()) return;
        setLoading(true);
        fetchJson(`/api/features/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: editContent })
        })
            .then(data => {
                setNotes(notes.map(n => n.id === id ? data : n));
                setEditingId(null);
                setEditContent('');
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    };

    const deleteNote = (id) => {
        setLoading(true);
        fetchJson(`/api/features/notes/${id}`, { method: 'DELETE' })
            .then(() => {
                setNotes(notes.filter(n => n.id !== id));
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    };

    return (
        <AppWindow
            title="Notes"
            testId="notes-window"
            isMaximized={isMaximized}
            onClose={onClose}
            onMinimize={onMinimize}
            onMaximize={onMaximize}
            zIndex={zIndex}
            onFocus={onFocus}
        >
            <div style={{ padding: '36px', backgroundColor: '#fdfbc8', height: '100%', overflowY: 'auto' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write a new note..."
                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #fcd34d', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                        id="notes_new_textarea"
                        data-testid="notes-new-textarea"
                    />
                    <button
                        onClick={saveNote}
                        disabled={loading || !newNote.trim()}
                        style={{ padding: '0 24px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: (loading || !newNote.trim()) ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                        id="notes_save_new_btn"
                        data-testid="notes-save-btn"
                    >
                        Save
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {notes.map(note => (
                        <div key={note.id} style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative' }}>
                            {editingId === note.id ? (
                                <div>
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #fcd34d', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                                        id={`note_edit_textarea_${note.id}`}
                                        data-testid={`note-edit-textarea-${note.id}`}
                                    />
                                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button onClick={cancelEdit} id={`note_edit_cancel_${note.id}_btn`} data-testid={`note-edit-cancel-${note.id}-btn`} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#64748b' }}>Cancel</button>
                                        <button onClick={() => saveEdit(note.id)} disabled={loading || !editContent.trim()} id={`note_edit_save_${note.id}_btn`} data-testid={`note-edit-save-${note.id}-btn`} style={{ padding: '6px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: (loading || !editContent.trim()) ? 'not-allowed' : 'pointer', fontWeight: '600' }}>Save</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ whiteSpace: 'pre-wrap', color: '#334155', fontSize: '15px' }}>{note.content}</div>
                                    <div style={{ marginTop: '12px', fontSize: '11px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{new Date(note.created_at).toLocaleString()} {note.created_at !== note.updated_at ? '(edited)' : ''}</span>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button onClick={() => startEdit(note)} id={`note_edit_${note.id}_btn`} data-testid={`note-edit-${note.id}-btn`} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Edit</button>
                                            <button onClick={() => deleteNote(note.id)} id={`note_delete_${note.id}_btn`} data-testid={`note-delete-${note.id}-btn`} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Delete</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    {notes.length === 0 && !loading && (
                        <div style={{ textAlign: 'center', color: '#b45309', padding: '40px', border: '1px dashed #fcd34d', borderRadius: '8px' }}>
                            No notes yet. Start writing above!
                        </div>
                    )}
                </div>
            </div>
        </AppWindow>
    );
};

export default NotesWindow;
