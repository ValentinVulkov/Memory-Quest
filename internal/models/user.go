package models

import "time"

type User struct {
	ID           uint      `gorm:"primaryKey;type:bigint unsigned" json:"id"`
	Username     string    `gorm:"size:50;not null;unique" json:"username"`
	Email        string    `gorm:"size:100;not null;unique" json:"email"`
	PasswordHash string    `gorm:"column:password_hash;not null" json:"-"`
	Role         string    `gorm:"type:enum('user','admin');default:'user'" json:"role"`
	CreatedAt    time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt    time.Time `gorm:"column:updated_at" json:"updated_at"`
}
