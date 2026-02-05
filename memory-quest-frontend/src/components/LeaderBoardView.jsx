import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchGlobalLeaderboard } from "../api";

export default function LeaderboardView() {
    const [rows, setRows] = useState([]);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        fetchGlobalLeaderboard()
            .then(setRows)
            .catch(e => setMsg(e.message));
    }, []);

    const card = {
        background: "#1e1e1e",
        padding: 14,
        borderRadius: 10,
        border: "1px solid #2a2a2a"
    };

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div style={card}>
                <Link to="/decks" style={{ color: "#fff" }}>← Back to decks</Link>
                <div style={{ marginTop: 10, fontWeight: 800, fontSize: 20 }}>
                    Global Leaderboard
                </div>
            </div>

            <div style={card}>
                {rows.length === 0 ? (
                    <div style={{ opacity: 0.7 }}>(No data yet)</div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr style={{ textAlign: "left", opacity: 0.7 }}>
                            <th>#</th>
                            <th>User</th>
                            <th>Total Correct</th>
                            <th>Quizzes Started</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((r, i) => (
                            <tr key={r.user_id} style={{ borderTop: "1px solid #333" }}>
                                <td>{i + 1}</td>
                                <td>{r.username}</td>
                                <td>{r.total_correct}</td>
                                <td>{r.quizzes_started}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {msg && <div style={card}>{msg}</div>}
        </div>
    );
}
