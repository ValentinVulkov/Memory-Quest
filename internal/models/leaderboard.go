package models

import "time"

// Leaderboard cached stats per user.
type Leaderboard struct {
	ID                    uint      `gorm:"primaryKey;type:bigint unsigned" json:"id"`
	UserID                uint      `gorm:"not null;uniqueIndex;type:bigint unsigned" json:"user_id"`
	TotalQuizzesCompleted int       `gorm:"default:0" json:"total_quizzes_completed"`
	HighestScore          int       `gorm:"default:0" json:"highest_score"`
	AverageAccuracy       float64   `gorm:"type:decimal(6,2);default:0" json:"average_accuracy"`
	LastUpdated           time.Time `gorm:"autoUpdateTime" json:"last_updated"`
}
