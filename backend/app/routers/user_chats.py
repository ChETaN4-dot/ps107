"""
Cloud Chat Persistence Router for BIS Saathi (PS107).
Stores and retrieves user chat sessions keyed by their verified Google Account ID/Email,
ensuring cross-device synchronization (Phone <-> Laptop).
"""

import os
import json
import sqlite3
import logging
from typing import List, Optional, Any
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

logger = logging.getLogger("bis_saathi.user_chats")

router = APIRouter(prefix="/user/chats", tags=["User Chats"])

# Path for SQLite storage
DB_DIR = os.path.join(os.path.dirname(__file__), "../../data")
os.makedirs(DB_DIR, exist_ok=True)
DB_PATH = os.path.join(DB_DIR, "user_chats.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    try:
        with get_db() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS user_sessions (
                    session_id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    persona TEXT DEFAULT 'msme',
                    language TEXT DEFAULT 'en',
                    messages TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            """)
            conn.execute("CREATE INDEX IF NOT EXISTS idx_user_id ON user_sessions(user_id)")
            conn.commit()
    except Exception as e:
        logger.error(f"Failed to initialize user_chats database: {e}")


# Initialize on module import
init_db()


class ChatSessionPayload(BaseModel):
    user_id: str
    session_id: str
    title: str
    persona: Optional[str] = "msme"
    language: Optional[str] = "en"
    messages: List[Any]
    updated_at: Optional[str] = None


@router.get("")
async def get_user_chats(user_id: str = Query(..., description="Verified Google user ID or email")):
    """Retrieve all chat sessions for a specific Google Account."""
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")

    clean_user = user_id.strip().lower()
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT session_id, title, persona, language, messages, updated_at "
                "FROM user_sessions WHERE LOWER(user_id) = ? ORDER BY rowid DESC",
                (clean_user,)
            )
            rows = cursor.fetchall()
            sessions = []
            for r in rows:
                try:
                    msgs = json.loads(r["messages"])
                except Exception:
                    msgs = []
                sessions.append({
                    "id": r["session_id"],
                    "title": r["title"],
                    "persona": r["persona"],
                    "language": r["language"],
                    "messages": msgs,
                    "updatedAt": r["updated_at"]
                })
            return {"status": "success", "user_id": clean_user, "sessions": sessions}
    except Exception as e:
        logger.error(f"Error fetching user chats for {clean_user}: {e}")
        return {"status": "error", "user_id": clean_user, "sessions": []}


@router.post("")
async def save_user_chat(payload: ChatSessionPayload):
    """Save or update a chat session for a specific Google Account."""
    if not payload.user_id or not payload.session_id:
        raise HTTPException(status_code=400, detail="user_id and session_id are required")

    clean_user = payload.user_id.strip().lower()
    messages_json = json.dumps(payload.messages, ensure_ascii=False)
    updated_at = payload.updated_at or ""

    try:
        with get_db() as conn:
            conn.execute("""
                INSERT INTO user_sessions (session_id, user_id, title, persona, language, messages, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(session_id) DO UPDATE SET
                    title = excluded.title,
                    persona = excluded.persona,
                    language = excluded.language,
                    messages = excluded.messages,
                    updated_at = excluded.updated_at
            """, (
                payload.session_id,
                clean_user,
                payload.title,
                payload.persona or "msme",
                payload.language or "en",
                messages_json,
                updated_at
            ))
            conn.commit()
        return {"status": "success", "session_id": payload.session_id}
    except Exception as e:
        logger.error(f"Error saving user chat {payload.session_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("")
async def delete_user_chat(
    user_id: str = Query(..., description="User ID / email"),
    session_id: Optional[str] = Query(None, description="Optional session ID to delete single session")
):
    """Delete a specific session or clear all sessions for a user."""
    clean_user = user_id.strip().lower()
    try:
        with get_db() as conn:
            if session_id:
                conn.execute(
                    "DELETE FROM user_sessions WHERE LOWER(user_id) = ? AND session_id = ?",
                    (clean_user, session_id)
                )
            else:
                conn.execute("DELETE FROM user_sessions WHERE LOWER(user_id) = ?", (clean_user,))
            conn.commit()
        return {"status": "success", "user_id": clean_user, "deleted_session_id": session_id}
    except Exception as e:
        logger.error(f"Error deleting chat for {clean_user}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
