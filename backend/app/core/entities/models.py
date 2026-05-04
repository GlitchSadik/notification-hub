from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

notification_audience = Table(
    "notification_audience",
    Base.metadata,
    Column("notification_id", ForeignKey("notifications.id"), primary_key=True),
    Column("role_id", ForeignKey("roles.id"), primary_key=True),
)

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    users = relationship("User", back_populates="role")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"))
    role = relationship("Role", back_populates="users")
    notifications = relationship("UserNotification", back_populates="user")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    target_roles = relationship("Role", secondary=notification_audience)

class UserNotification(Base):
    __tablename__ = "user_notifications"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    notification_id = Column(Integer, ForeignKey("notifications.id"), primary_key=True)
    is_read = Column(Boolean, default=False)
    received_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="notifications")
