package models

import "time"

// QuizQuestion represents a single question generated for a Quiz.
type QuizQuestion struct {
	ID            uint      `gorm:"primaryKey;type:bigint unsigned" json:"id"`
	QuizID        uint      `gorm:"column:quiz_id;not null;index;type:bigint unsigned" json:"quiz_id"`
	CardID        uint      `gorm:"column:card_id;not null;index;type:bigint unsigned" json:"card_id"`
	QuestionText  string    `gorm:"type:text" json:"question_text"`
	CorrectAnswer string    `gorm:"type:text" json:"correct_answer"`
	CreatedAt     time.Time `gorm:"column:created_at" json:"created_at"`
}
