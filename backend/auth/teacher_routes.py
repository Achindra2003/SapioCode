from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId
import random
import string

from mongo import db
from auth.auth_routes import get_current_user

router = APIRouter(prefix="/teacher", tags=["Teacher"])

def require_teacher(user=Depends(get_current_user)):
    if user.get("role") != "teacher":
        raise HTTPException(status_code=403, detail="Teacher access required")
    return user

@router.post("/classes")
def create_class(name: str, teacher=Depends(require_teacher)):

    cohort_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

    new_class = {
        "name": name,
        "instructor_id": ObjectId(teacher["_id"]),
        "cohort_code": cohort_code,
        "students": [],
        "topics_assigned": [],
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = db.classes.insert_one(new_class)

    return {
        "message": "Class created",
        "class_id": str(result.inserted_id),
        "cohort_code": cohort_code
    }