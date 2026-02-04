package models

import "time"

// Quiz represents a quiz generated from a Deck.
type Quiz struct {
	ID        uint      `gorm:"primaryKey;type:bigint unsigned" json:"id"`
	UserID    uint      `gorm:"column:user_id;not null;index;type:bigint unsigned" json:"user_id"`
	DeckID    uint      `gorm:"column:deck_id;not null;index;type:bigint unsigned" json:"deck_id"`
	Title     string    `gorm:"size:100" json:"title"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`

	Questions []QuizQuestion `gorm:"foreignKey:QuizID" json:"questions,omitempty"`
}
