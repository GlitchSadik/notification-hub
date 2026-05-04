from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class RoleBase(BaseModel):
    id: int
    name: str
    class Config: from_attributes = True

class UserBase(BaseModel):
    id: int
    username: str
    role: RoleBase
    class Config: from_attributes = True

class NotificationCreate(BaseModel):
    title: str
    message: str
    role_ids: List[int] = [] # Empty means "All"

class NotificationRead(BaseModel):
    id: int
    title: str
    message: str
    created_at: datetime
    is_read: bool
    class Config: from_attributes = True
