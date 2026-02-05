package api

import (
	"memory-quest-backend/internal/db"

	"github.com/gin-gonic/gin"
)

type GlobalLeaderboardRow struct {
	UserID         uint   `json:"user_id"`
	Username       string `json:"username"`
	TotalCorrect   int64  `json:"total_correct"`
	QuizzesStarted int64  `json:"quizzes_started"`
}

func GetGlobalLeaderboard(c *gin.Context) {
	rows := []GlobalLeaderboardRow{}

	err := db.DB.Raw(`
		SELECT 
			u.id AS user_id,
			u.username AS username,
			COALESCE(SUM(qr.score), 0) AS total_correct,
			COUNT(qr.id) AS quizzes_started
		FROM users u
		JOIN quiz_results qr ON qr.user_id = u.id
		GROUP BY u.id, u.username
		ORDER BY total_correct DESC, quizzes_started DESC, u.id ASC
		LIMIT 100
	`).Scan(&rows).Error

	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to load leaderboard"})
		return
	}

	c.JSON(200, gin.H{"leaderboard": rows})
}
