// src/lib/firestore.ts
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  DocumentData,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
} from 'firebase/firestore';

// For saving a note
export type NewNote = {
    title: string;
    content: string;
    tags: string[];
    createdAt?: string;
  };

// For displaying a note (after saved)
export type ScribblyNote = NewNote & {
    id: string;
    createdAt: string; // ✅ now required
  };

  export const saveNote = async (note: NewNote, userId: string): Promise<ScribblyNote> => {
    const docRef = await addDoc(collection(db, 'notes'), {
      ...note,
      userId,
      createdAt: Timestamp.now(),
    });
  
    return {
      id: docRef.id,
      ...note,
      createdAt: new Date().toISOString(), // string format for display
    };
  };
  
  
  export const getNotesByUser = async (userId: string): Promise<ScribblyNote[]> => {
    const q = query(collection(db, 'notes'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
  
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        tags: data.tags || [],
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      };
    });
  };

  export const deleteNote = async (noteId: string) => {
    const noteRef = doc(db, 'notes', noteId);
    await deleteDoc(noteRef);
  };
  
  export const updateNote = async (note: ScribblyNote) => {
    const noteRef = doc(db, 'notes', note.id);
    await updateDoc(noteRef, {
      title: note.title,
      content: note.content,
      tags: note.tags,
    });
  };

  export const getNoteById = async (id: string) => {
    const docRef = doc(db, 'notes', id);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as any;
    } else {
      return null;
    }
  };