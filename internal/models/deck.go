package models

import "time"

type Deck struct {
	ID          uint      `gorm:"primaryKey;type:bigint unsigned" json:"id"`
	UserID      uint      `gorm:"column:user_id;not null;index;type:bigint unsigned" json:"user_id"`
	Title       string    `gorm:"size:100;not null" json:"title"`
	Description string    `json:"description"`
	IsPublic    bool      `gorm:"column:is_public;default:false" json:"is_public"`
	CreatedAt   time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt   time.Time `gorm:"column:updated_at" json:"updated_at"`

	Cards []Card `gorm:"foreignKey:DeckID" json:"cards,omitempty"`
}
