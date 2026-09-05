from sqlalchemy import Column, Integer, BigInteger, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Trip(Base):
    __tablename__ = "trips"
    id               = Column(Integer,  primary_key=True)
    user_id          = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    destination      = Column(String,   nullable=False)
    days             = Column(Integer,  nullable=False)
    budget           = Column(Float,    nullable=False)
    travel_style     = Column(String,   nullable=True)
    category         = Column(String,   nullable=False)
    daily_budget     = Column(Float,    nullable=False)
    user = relationship("User", back_populates="trips")
    ai_recommendation= Column(Text,     nullable=True)
    created_at       = Column(DateTime(timezone=True),server_default=func.now(),nullable=False)