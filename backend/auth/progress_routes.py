from fastapi import APIRouter, HTTPException
from datetime import datetime
from bson import ObjectId
import uuid

from mongo import progress_collection, sessions_collection
from schemas import ProgressCompleteRequest, SessionCreateRequest, SessionMessageRequest

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.post("/complete")
def complete_question(data: ProgressCompleteRequest):
    existing = progress_collection.find_one({
        "user_id": data.user_id,
        "question_id": data.question_id
    })

    if existing:
        progress_collection.update_one(
            {"_id": existing["_id"]},
            {
                "$set": {
                    "status": "mastered" if data.viva_verdict == "pass" else "in_progress",
                    "viva_score": data.viva_score,
                    "viva_verdict": data.viva_verdict,
                    "time_spent_seconds": data.time_spent_seconds,
                    "test_cases_passed": data.test_cases_passed,
                    "test_cases_total": data.test_cases_total,
                    "code_snapshot": data.code_snapshot,
                    "completed_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                },
                "$inc": {"attempts": 1}
            }
        )
    else:
        progress_collection.insert_one({
            "user_id": data.user_id,
            "question_id": data.question_id,
            "topic_id": data.topic_id,
            "status": "mastered" if data.viva_verdict == "pass" else "in_progress",
            "viva_score": data.viva_score,
            "viva_verdict": data.viva_verdict,
            "attempts": 1,
            "time_spent_seconds": data.time_spent_seconds,
            "test_cases_passed": data.test_cases_passed,
            "test_cases_total": data.test_cases_total,
            "code_snapshot": data.code_snapshot,
            "completed_at": datetime.utcnow(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        })

    return {"status": "recorded"}


@router.get("/{user_id}")
def get_user_progress(user_id: str):
    progress = list(progress_collection.find({"user_id": user_id}))

    result = []
    for p in progress:
        result.append({
            "user_id": p["user_id"],
            "question_id": p["question_id"],
            "topic_id": p["topic_id"],
            "status": p["status"],
            "viva_score": p["viva_score"],
            "viva_verdict": p["viva_verdict"],
            "attempts": p["attempts"],
            "time_spent_seconds": p["time_spent_seconds"],
            "test_cases_passed": p["test_cases_passed"],
            "test_cases_total": p["test_cases_total"],
            "completed_at": p.get("completed_at"),
        })

    return result


@router.get("/{user_id}/topic/{topic_id}")
def get_topic_progress(user_id: str, topic_id: str):
    progress = list(progress_collection.find({
        "user_id": user_id,
        "topic_id": topic_id
    }))

    result = []
    for p in progress:
        result.append({
            "user_id": p["user_id"],
            "question_id": p["question_id"],
            "topic_id": p["topic_id"],
            "status": p["status"],
            "viva_score": p["viva_score"],
            "viva_verdict": p["viva_verdict"],
            "attempts": p["attempts"],
            "time_spent_seconds": p["time_spent_seconds"],
            "test_cases_passed": p["test_cases_passed"],
            "test_cases_total": p["test_cases_total"],
            "completed_at": p.get("completed_at"),
        })

    return result
