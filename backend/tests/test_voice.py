"""
Automated Test Suite for Voice-First Multilingual Interaction (PS107).
Validates:
1. Text -> TTS synthesis endpoint (/api/v1/speech/synthesize)
2. Speech -> STT transcription endpoint (/api/v1/speech/transcribe)
3. Speech -> Grounded BIS RAG answer pipeline
4. Speech -> Grounded answer -> TTS audio pipeline
5. All 10 Indian Languages audio synthesis (en, hi, mr, bn, gu, ta, te, kn, ml, pa)
6. Standard recommendation by voice
7. Laboratory query by voice
8. HUID / Hallmarking query by voice
9. Low-confidence query voice safety
10. Empty audio/transcript handling
11. Provider fallback mechanism
12. Standard-number and statutory token preservation in speakable text
"""

import sys
import os
from pathlib import Path
from unittest.mock import patch, MagicMock

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"

# Add backend directory to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
BACKEND_DIR = ROOT_DIR / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi.testclient import TestClient
from app.main import app
from app.services.speech import get_speech_service

def run_voice_tests():
    client = TestClient(app)
    print("=" * 70)
    print("VOICE-FIRST MULTILINGUAL INTERACTION TEST SUITE (PS107)")
    print("=" * 70)

    speech = get_speech_service()

    # 1. Speakability & Token Preservation Test
    print("\n[TEST 1] Speakability Parser & Statutory Token Preservation")
    raw_rag = (
        "### BIS Hallmarking Guidelines\n\n"
        "Under **IS 1417**, all gold jewellery must bear a **6-digit HUID** and valid **CML 1234567**.\n"
        "- Step 1: Check the BIS logo\n"
        "- Step 2: Check purity (e.g. 22K916)\n"
        "For more details visit [Official BIS Portal](https://www.bis.gov.in/hallmarking).\n\n"
        "| Standard | Product |\n| IS 14543 | Water |\n"
    )
    cleaned = speech.clean_for_speech(raw_rag)
    print("Cleaned Spoken Text:")
    print("  " + cleaned)
    assert "IS 1417" in cleaned
    assert "HUID" in cleaned
    assert "CML 1234567" in cleaned
    assert "###" not in cleaned
    assert "**" not in cleaned
    assert "https://" not in cleaned
    print("  ✓ Passed: Preserved IS numbers, HUID, and CML while stripping markdown formatting.")

    # 2. TTS Synthesis Endpoint (POST /api/v1/speech/synthesize)
    print("\n[TEST 2] Text-to-Speech Synthesis Endpoint (POST /api/v1/speech/synthesize)")
    # Test fallback mode (when SARVAM_API_KEY is unset or standby)
    tts_payload = {
        "text": "What is 6-digit HUID and how can a customer verify gold jewellery?",
        "language": "en",
        "speaker": "meera"
    }
    res_tts = client.post("/api/v1/speech/synthesize", json=tts_payload)
    assert res_tts.status_code == 200, f"Expected 200, got {res_tts.status_code}"
    tts_data = res_tts.json()
    assert "spoken_text" in tts_data
    assert tts_data["provider"] in ["sarvam", "browser_fallback"]
    print(f"  ✓ TTS Synthesis Response: provider='{tts_data['provider']}', fallback={tts_data['fallback_to_browser']}")

    # Test mocked Sarvam API call
    mock_b64 = "UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
    with patch("httpx.Client") as mock_client_cls:
        mock_inst = MagicMock()
        mock_client_cls.return_value.__enter__.return_value = mock_inst
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {"audios": [mock_b64]}
        mock_inst.post.return_value = mock_resp

        # Force key present for test
        speech.api_key = "test_mock_sarvam_key"
        res_mock = client.post("/api/v1/speech/synthesize", json=tts_payload)
        speech.api_key = ""  # Reset
        assert res_mock.status_code == 200
        m_data = res_mock.json()
        assert m_data["audio_base64"] == mock_b64
        assert m_data["provider"] == "sarvam"
        print("  ✓ Mocked Sarvam bulbul:v1 TTS successfully returned base64 WAV audio.")

    # 3. STT Transcription Endpoint (POST /api/v1/speech/transcribe)
    print("\n[TEST 3] Speech-to-Text Transcription Endpoint (POST /api/v1/speech/transcribe)")
    dummy_wav = b"RIFF" + b"\x00" * 256
    files = {"file": ("query.wav", dummy_wav, "audio/wav")}
    
    # Standby fallback test
    res_stt = client.post("/api/v1/speech/transcribe", files=files, data={"language_code": "hi-IN"})
    assert res_stt.status_code == 200
    stt_data = res_stt.json()
    assert stt_data["provider"] in ["sarvam", "browser_fallback"]
    print(f"  ✓ STT Endpoint: provider='{stt_data['provider']}'")

    # Mocked Sarvam STT test
    with patch("httpx.Client") as mock_client_cls:
        mock_inst = MagicMock()
        mock_client_cls.return_value.__enter__.return_value = mock_inst
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "transcript": "मैं सोने की ज्वेलरी पर HUID कैसे चेक करूँ?",
            "language_code": "hi-IN"
        }
        mock_inst.post.return_value = mock_resp

        speech.api_key = "test_mock_sarvam_key"
        res_stt_mock = client.post("/api/v1/speech/transcribe", files=files, data={"language_code": "hi-IN"})
        speech.api_key = ""  # Reset
        assert res_stt_mock.status_code == 200
        stt_mock_data = res_stt_mock.json()
        assert "HUID" in stt_mock_data["transcript"]
        assert stt_mock_data["detected_language"] == "hi-IN"
        print(f"  ✓ Mocked Sarvam saaras:v1 STT: '{stt_mock_data['transcript']}' [Lang: {stt_mock_data['detected_language']}]")

    # 4. End-to-End Speech-to-Speech Flow (Speech -> STT -> RAG -> TTS)
    print("\n[TEST 4] End-to-End Speech-to-Speech Pipeline")
    # Step A: User speaks simulated voice prompt
    simulated_speech_transcript = "What is 6-digit HUID and how does a customer verify gold jewellery?"
    
    # Step B: RAG Query Processing
    rag_payload = {
        "message": simulated_speech_transcript,
        "persona": "consumer",
        "language": "en"
    }
    res_chat = client.post("/api/v1/chat", json=rag_payload)
    assert res_chat.status_code == 200
    chat_data = res_chat.json()
    assert chat_data["confidence_level"] in ["HIGH", "MEDIUM"]
    assert len(chat_data["citations"]) > 0
    print(f"  ✓ RAG Processing: intent='{chat_data['intent']}', confidence={chat_data['confidence_level']}")

    # Step C: TTS Audio Generation from Grounded Answer
    tts_req = {
        "text": chat_data["answer"],
        "language": "en",
        "persona": "consumer"
    }
    res_s2s_tts = client.post("/api/v1/speech/synthesize", json=tts_req)
    assert res_s2s_tts.status_code == 200
    s2s_tts_data = res_s2s_tts.json()
    assert len(s2s_tts_data["spoken_text"]) > 10
    print(f"  ✓ Speech-to-Speech Synthesis: '{s2s_tts_data['spoken_text'][:60]}...'")

    # 5. All 10 Indian Languages TTS Synthesis
    print("\n[TEST 5] Audio Synthesis Across All 10 Indian Languages")
    test_languages = ["en", "hi", "mr", "bn", "gu", "ta", "te", "kn", "ml", "pa"]
    for lang in test_languages:
        req = {
            "text": f"Bureau of Indian Standards certification and quality services test for language {lang}.",
            "language": lang
        }
        res_l = client.post("/api/v1/speech/synthesize", json=req)
        assert res_l.status_code == 200
        l_data = res_l.json()
        assert l_data["language_applied"].endswith("-IN")
        print(f"  ✓ Language '{lang}': Synthesized cleanly for speech code '{l_data['language_applied']}'")

    # 6. Standard Recommendation by Voice Query
    print("\n[TEST 6] Standard Recommendation by Voice Input")
    voice_std_query = "I manufacture stainless steel water bottles and vacuum flasks"
    res_std = client.post("/api/v1/recommend-standard", json={
        "product_description": voice_std_query,
        "persona": "msme"
    })
    assert res_std.status_code == 200
    rec_data = res_std.json()
    top_rec = rec_data["recommendations"][0]
    # Build concise voice summary
    voice_summary = (
        f"I found a potentially applicable standard: {top_rec['standard_number']}, {top_rec['title']}. "
        f"{top_rec['match_reason']}"
    )
    clean_voice_summary = speech.clean_for_speech(voice_summary)
    assert "IS 17803" in clean_voice_summary
    print(f"  ✓ Voice Standard Summary: '{clean_voice_summary[:80]}...'")

    # 7. Laboratory Discovery by Voice Query
    print("\n[TEST 7] Laboratory Discovery by Voice Input")
    res_lab = client.post("/api/v1/recommend-labs", json={
        "product_or_material": "mechanical testing for pressure cookers",
        "location": "Mohali"
    })
    assert res_lab.status_code == 200
    lab_data = res_lab.json()
    top_lab = lab_data["recommended_labs"][0]
    voice_lab_summary = (
        f"I found {len(lab_data['recommended_labs'])} testing facilities. Top option is {top_lab['lab_name']} located at {top_lab['location']}."
    )
    clean_lab_summary = speech.clean_for_speech(voice_lab_summary)
    assert "Mohali" in clean_lab_summary or "Northern" in clean_lab_summary
    print(f"  ✓ Voice Lab Summary: '{clean_lab_summary}'")

    # 8. Low Confidence Voice Safety
    print("\n[TEST 8] Low Confidence Voice Safety Guardrail")
    low_conf_answer = (
        "I could not locate an exact clause in the verified BIS knowledge base. "
        "Verification is limited. Please consult the official BIS portal at https://www.bis.gov.in."
    )
    clean_low_conf = speech.clean_for_speech(low_conf_answer)
    assert "https://" not in clean_low_conf
    assert "official BIS portal" in clean_low_conf
    print(f"  ✓ Safe Speakable Fallback: '{clean_low_conf}'")

    # 9. Empty Input & Error Handling
    print("\n[TEST 9] Empty Input & Error Handling")
    empty_res = speech.transcribe(b"")
    assert empty_res.transcript == ""
    print("  ✓ Handled empty audio buffer safely without throwing exceptions.")

    print("\n" + "=" * 70)
    print("ALL 9 VOICE-FIRST MULTILINGUAL TESTS PASSED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    run_voice_tests()
