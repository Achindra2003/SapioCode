from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str


class AuthResponse(BaseModel):
    access_token: str
    user: UserResponse


class ProgressCompleteRequest(BaseModel):
    user_id: str
    question_id: str
    topic_id: str
    viva_score: float
    viva_verdict: str
    time_spent_seconds: int
    test_cases_passed: int
    test_cases_total: int
    code_snapshot: str


class UserProgressResponse(BaseModel):
    user_id: str
    question_id: str
    topic_id: str
    status: str
    viva_score: float
    viva_verdict: str
    attempts: int
    time_spent_seconds: int
    test_cases_passed: int
    test_cases_total: int
    completed_at: Optional[datetime] = None


class SessionCreateRequest(BaseModel):
    user_id: str


class SessionMessageRequest(BaseModel):
    role: str
    content: str
