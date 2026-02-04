package models

import "time"

type Card struct {
	ID        uint      `gorm:"primaryKey;type:bigint unsigned" json:"id"`
	DeckID    uint      `gorm:"column:deck_id;not null;index;type:bigint unsigned" json:"deck_id"`
	Question  string    `gorm:"not null" json:"question"`
	Answer    string    `gorm:"not null" json:"answer"`
	ImageURL  string    `gorm:"column:image_url" json:"image_url"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updated_at"`
}
