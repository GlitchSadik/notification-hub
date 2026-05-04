from app.infrastructure.db import SessionLocal, engine
from app.core.entities.models import Base, Role, User

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    if db.query(Role).first():
        return

    roles = ["Admin", "Manager", "Editor", "Viewer", "Support"]
    role_objs = {name: Role(name=name) for name in roles}
    db.add_all(role_objs.values())
    db.commit()

    users = [
        ("alice_admin", "Admin"),
        ("bob_manager", "Manager"),
        ("charlie_editor", "Editor"),
        ("david_viewer", "Viewer"),
        ("eve_support", "Support"),
        ("frank_viewer", "Viewer"),
    ]
    
    for username, role_name in users:
        user = User(username=username, role=role_objs[role_name])
        db.add(user)
    
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_db()
