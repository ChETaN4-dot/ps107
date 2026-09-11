"""
Chat and Recommendation router for BIS Saathi (PS107).
Exposes:
- POST /api/v1/chat & /api/chat (Conversational assistant with citation-grounded RAG)
- POST /api/v1/recommend-standard & /api/recommend-standard (Dedicated product-to-standard recommender)
- POST /api/v1/recommend-labs & /api/recommend-labs (Verified BIS laboratory discovery)
"""

import logging
from fastapi import APIRouter, HTTPException, Depends, status

from app.models.schemas import (
    ChatRequest, ChatResponse,
    StandardRecommendationRequest, StandardRecommendationResponse,
    LabRecommendationRequest, LabRecommendationResponse,
    TranslateMessagesRequest, TranslateMessagesResponse,
    ModeType
)
from app.services.rag import RAGService, get_rag_service
from app.services.standard_recommender import StandardRecommender, get_standard_recommender
from app.services.lab_recommender import LabRecommender, get_lab_recommender
from app.services.sarvam import SarvamMultilingualService, get_sarvam_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="", tags=["Chat & Recommendations"])

@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Process conversational query or standard recommendation",
    description="Accepts user message, persona, mode ('ask_bis' | 'find_my_standard'), and language. Returns grounded response with verified citations."
)
async def chat_endpoint(
    request: ChatRequest,
    rag_service: RAGService = Depends(get_rag_service),
    recommender: StandardRecommender = Depends(get_standard_recommender)
) -> ChatResponse:
    try:
        logger.info(f"Incoming chat query: '{request.message[:60]}...' | Persona: {request.persona} | Mode: {request.mode}")
        
        # If user is in "Find My Standard" mode, leverage the dedicated recommendation engine
        if request.mode == ModeType.FIND_MY_STANDARD:
            rec_req = StandardRecommendationRequest(
                product_description=request.message,
                persona=request.persona,
                language=request.language
            )
            rec_res = recommender.recommend(rec_req, top_k=4)
            
            # Format conversational summary of recommendations
            if rec_res.recommendations:
                lines = [
                    f"Based on your product description **'{request.message}'**, here are the potentially applicable Indian Standards from verified BIS records:\n"
                ]
                for idx, r in enumerate(rec_res.recommendations):
                    qco_tag = " [Mandatory QCO]" if r.qco_mandatory else ""
                    lines.append(f"**{idx+1}. {r.standard_number}: {r.title}**{qco_tag}")
                    lines.append(f"   • **Category:** {r.category}")
                    lines.append(f"   • **Why it applies:** {r.match_reason}")
                    lines.append(f"   • **Official Portal:** [{r.source_url}]({r.source_url})\n")
                lines.append(f"> ⚠️ *Disclaimer: {rec_res.informational_disclaimer}*")
                answer_text = "\n".join(lines)
            else:
                answer_text = (
                    f"We couldn't confidently identify an applicable Indian Standard for **'{request.message}'** "
                    f"from the available BIS metadata.\n\n"
                    "**Suggestions:**\n"
                    "1. Try describing the product in more specific detail (materials, purpose, or sector).\n"
                    "2. Search the official BIS Standards Portal directly: [standards.bis.gov.in](https://standards.bis.gov.in)\n"
                    "3. Consult your nearest BIS Branch Office for official conformity classification."
                )

            from app.models.schemas import Citation, SuggestedAction
            citations = []
            for r in rec_res.recommendations[:3]:
                citations.append(Citation(
                    source_title=f"Indian Standard {r.standard_number}",
                    source_url=r.source_url,
                    section=r.title,
                    excerpt=r.match_reason,
                    category=r.category,
                    authority="Bureau of Indian Standards (BIS)",
                    relevance_score=r.confidence
                ))

            suggested_actions = [
                SuggestedAction(
                    title="Search on Official BIS Standards Portal",
                    description="Access complete standards formulation records and preview clauses.",
                    url="https://standards.bis.gov.in",
                    badge="Standards Portal",
                    action_type="portal_link"
                ),
                SuggestedAction(
                    title="View Mandatory QCO Product List",
                    description="Verify statutory compliance dates for products under compulsory certification.",
                    url="https://www.bis.gov.in/product-certification/products-under-compulsory-certification/",
                    badge="Mandatory QCOs",
                    action_type="portal_link"
                )
            ]

            return ChatResponse(
                answer=answer_text,
                confidence=rec_res.recommendations[0].confidence if rec_res.recommendations else 0.40,
                confidence_level=rec_res.confidence_level,
                citations=citations,
                intent="standard_search",
                category="standards_metadata",
                persona_applied=request.persona,
                mode_applied=ModeType.FIND_MY_STANDARD,
                suggested_actions=suggested_actions,
                suggested_followups=[
                    "Does this product require compulsory BIS certification under QCO?",
                    "What testing laboratories are available for this standard?",
                    "What are the application fees for MSMEs under Option 2?"
                ],
                retrieval_method="standard_recommender_hybrid",
                standard_recommendations=rec_res.recommendations
            )

        # Standard Ask BIS conversational mode
        response = rag_service.process_query(request)
        return response

    except Exception as e:
        logger.error(f"Error processing chat request: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing your request: {str(e)}"
        )

@router.post(
    "/recommend-standard",
    response_model=StandardRecommendationResponse,
    status_code=status.HTTP_200_OK,
    summary="Recommend Indian Standards from product description",
    description="Analyzes product description against 741+ verified Indian Standards metadata and returns ranked recommendations with explainable match reasons."
)
async def recommend_standard_endpoint(
    request: StandardRecommendationRequest,
    recommender: StandardRecommender = Depends(get_standard_recommender)
) -> StandardRecommendationResponse:
    try:
        logger.info(f"Standard recommendation request for: '{request.product_description[:60]}...'")
        return recommender.recommend(request)
    except Exception as e:
        logger.error(f"Error in standard recommendation: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating standard recommendations: {str(e)}"
        )

@router.post(
    "/recommend-labs",
    response_model=LabRecommendationResponse,
    status_code=status.HTTP_200_OK,
    summary="Discover verified BIS testing laboratories",
    description="Suggests official BIS central, regional, and branch laboratories for testing products based on location and discipline."
)
async def recommend_labs_endpoint(
    request: LabRecommendationRequest,
    lab_recommender: LabRecommender = Depends(get_lab_recommender)
) -> LabRecommendationResponse:
    try:
        logger.info(f"Lab discovery request for: '{request.product_or_material}' | Location: {request.location}")
        return lab_recommender.recommend(request)
    except Exception as e:
        logger.error(f"Error in laboratory recommendation: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while finding laboratories: {str(e)}"
        )

@router.post(
    "/translate-messages",
    response_model=TranslateMessagesResponse,
    status_code=status.HTTP_200_OK,
    summary="Translate conversation chat messages into target Indian language",
    description="Batch translates existing user and assistant chat messages into newly selected language."
)
async def translate_messages_endpoint(
    request: TranslateMessagesRequest,
    sarvam_service: SarvamMultilingualService = Depends(get_sarvam_service)
) -> TranslateMessagesResponse:
    try:
        logger.info(f"Translating {len(request.messages)} chat messages to [{request.target_language.value}]...")
        translated = sarvam_service.translate_messages(
            messages=request.messages,
            target_lang=request.target_language,
            source_lang=request.source_language
        )
        return TranslateMessagesResponse(
            messages=translated,
            target_language=request.target_language,
            translated_count=len(translated)
        )
    except Exception as e:
        logger.error(f"Error in translating messages: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Message translation failed: {str(e)}"
        )
