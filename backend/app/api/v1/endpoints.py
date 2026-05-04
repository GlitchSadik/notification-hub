from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.infrastructure.db import get_db
from app.core.entities import models, schemas
from app.infrastructure.realtime.manager import manager

router = APIRouter()

@router.get("/users", response_model=list[schemas.UserBase])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.get("/roles", response_model=list[schemas.RoleBase])
def get_roles(db: Session = Depends(get_db)):
    return db.query(models.Role).all()

@router.post("/notifications")
async def create_notification(data: schemas.NotificationCreate, db: Session = Depends(get_db)):
    # 1. Create notification
    notif = models.Notification(title=data.title, message=data.message)
    if data.role_ids:
        roles = db.query(models.Role).filter(models.Role.id.in_(data.role_ids)).all()
        notif.target_roles = roles
    db.add(notif)
    db.flush()

    # 2. Link to users
    users_query = db.query(models.User)
    if data.role_ids:
        users_query = users_query.filter(models.User.role_id.in_(data.role_ids))
    
    target_users = users_query.all()
    for user in target_users:
        db.add(models.UserNotification(user_id=user.id, notification_id=notif.id))
    
    db.commit()

    # 3. Broadcast real-time
    await manager.broadcast({
        "type": "NEW_NOTIFICATION",
        "data": {
            "id": notif.id,
            "title": notif.title,
            "message": notif.message,
            "created_at": notif.created_at.isoformat(),
            "target_roles": [r.id for r in notif.target_roles]
        }
    })
    return {"status": "sent"}

@router.get("/notifications/{user_id}", response_model=list[schemas.NotificationRead])
def get_notifications(user_id: int, db: Session = Depends(get_db)):
    results = db.query(
        models.Notification.id,
        models.Notification.title,
        models.Notification.message,
        models.Notification.created_at,
        models.UserNotification.is_read
    ).join(models.UserNotification).filter(models.UserNotification.user_id == user_id).order_by(models.Notification.created_at.desc()).all()
    return results

@router.patch("/notifications/{notif_id}/read/{user_id}")
def mark_read(notif_id: int, user_id: int, db: Session = Depends(get_db)):
    notif = db.query(models.UserNotification).filter_by(notification_id=notif_id, user_id=user_id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"status": "updated"}
