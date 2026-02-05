import React, { useEffect, useMemo, useState } from "react";
import { submitQuizAnswer } from "../api";


export default function QuizModal({ open, token, quiz, cards, deckTitle, onClose }) {
    const questions = useMemo(() => quiz?.questions ?? [], [quiz]);
    const total = quiz?.total_questions ?? questions.length ?? 0;

    const [idx, setIdx] = useState(0);
    const [busy, setBusy] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(0);
    const [selectedIdx, setSelectedIdx] = useState(null);
    const [correctIdx, setCorrectIdx] = useState(null);
    const [finished, setFinished] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);

    // Reset when opened / new quiz
    useEffect(() => {
        if (!open) return;
        setIdx(0);
        setBusy(false);
        setFeedback("");
        setScore(0);
        setAnswered(0);
        setSelectedIdx(null);
        setCorrectIdx(null);
        setFinished(false);
        setFinalScore(0);
        setFinalTotal(0);
    }, [open, quiz?.quiz_result_id]);

    if (!open) return null;

    const q = questions[idx];
    const qText = q?.question ?? "";
    const options = Array.isArray(q?.options) ? q.options : [];
    const resultId = quiz?.quiz_result_id;

    // Find correct answer from the deck cards already loaded in DeckDetailView
    function getCorrectAnswerFor(cardId) {
        const found = (Array.isArray(cards) ? cards : []).find(
            (c) => Number(c.id ?? c.ID) === Number(cardId)
        );
        return found?.answer ?? found?.Answer ?? "";
    }

    const overlay = {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 9999,
    };

    const panel = {
        width: "min(760px, 100%)",
        background: "#2a2a2a",
        border: "1px solid #2a2a2a",
        borderRadius: 14,
        padding: 16,
        color: "#fff",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
    };

    const btn = {
        padding: "10px 12px",
        cursor: "pointer",
        background: "#1f1f1f",
        color: "#fff",
        border: "1px solid #2f2f2f",
        borderRadius: 10,
    };

    const optionBtn = (i, disabled) => {
        const isChosen = selectedIdx === i;
        const isCorrect = correctIdx === i;
        const isWrongChosen = isChosen && correctIdx !== null && !isCorrect;

        let background = "#1f1f1f";
        let border = "1px solid #333";

        if (correctIdx !== null) {
            if (isCorrect) {
                background = "#14532d"; // green-ish
                border = "1px solid #22c55e";
            } else if (isWrongChosen) {
                background = "#7f1d1d"; // red-ish
                border = "1px solid #ef4444";
            }
        }

        return {
            width: "100%",
            textAlign: "left",
            padding: "14px 14px",
            cursor: disabled ? "not-allowed" : "pointer",
            background,
            color: "#fff",
            border,
            borderRadius: 10,
            opacity: disabled ? 0.9 : 1,
            transition: "background 150ms ease, border-color 150ms ease",
        };
    };


    async function choose(optionText, optionIndex) {
        if (!resultId || busy) return;
        if (!q) return;

        const correct = getCorrectAnswerFor(q.card_id);

        // Find correct index among the 4 options
        const cIdx = options.findIndex((x) => String(x) === String(correct));

        const isCorrect = String(optionText) === String(correct);

        setSelectedIdx(optionIndex);
        setCorrectIdx(cIdx);

        setBusy(true);
        setFeedback(isCorrect ? "✅ Correct" : "❌ Wrong");

        try {
            const res = await submitQuizAnswer(token, resultId, isCorrect);

            // Sync with backend
            setScore(res.score ?? (isCorrect ? score + 1 : score));
            setAnswered(res.answered_count ?? (answered + 1));

            // 2 seconds delay so the user sees the highlight
            setTimeout(() => {
                if (res.completed) {
                    setFinalScore(res.score ?? score);
                    setFinalTotal(res.total_questions ?? total);
                    setFinished(true);
                    setBusy(false);
                    return;
                }

                // next question
                setFeedback("");
                setSelectedIdx(null);
                setCorrectIdx(null);
                setIdx((i) => Math.min(i + 1, questions.length - 1));
                setBusy(false);
            }, 2000);
        } catch (e) {
            setBusy(false);
            setFeedback("Submit failed: " + (e?.message || String(e)));
        }
    }

    return (
        <div style={overlay} onClick={onClose}>
            <div style={panel} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div style={{ opacity: 0.85 }}>
                        Quiz • {Math.min(answered + 1, total)}/{total} • Score: {score}
                    </div>
                    <button type="button" style={btn} onClick={onClose}>
                        ✕ Close
                    </button>
                </div>

                <div style={{ marginTop: 14, padding: 18, border: "1px solid #333", borderRadius: 12, background: "#1b1b1b" }}>
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>
                        QUESTION
                    </div>
                    <div style={{ fontSize: 20, lineHeight: 1.35 }}>
                        {qText || <span style={{ opacity: 0.7 }}>(empty)</span>}
                    </div>
                </div>

                <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                    {options.map((opt, i) => {
                        const label = ["A", "B", "C", "D"][i] ?? "?";
                        return (
                            <button
                                key={`${label}-${i}`}
                                type="button"
                                disabled={busy}
                                style={optionBtn(i, busy)}
                                onClick={() => choose(opt, i)}
                            >
                                <b style={{ marginRight: 10 }}>{label}.</b> {opt}
                            </button>
                        );
                    })}
                </div>

                {feedback && (
                    <div style={{ marginTop: 12, opacity: 0.9, fontSize: 14 }}>
                        {feedback}
                    </div>
                )}

                {finished && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.65)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 14,
                            padding: 16,
                        }}
                    >
                        <div
                            style={{
                                width: "min(520px, 100%)",
                                background: "#1b1b1b",
                                border: "1px solid #333",
                                borderRadius: 14,
                                padding: 18,
                                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>QUIZ FINISHED</div>
                            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
                                {deckTitle || "Deck"}
                            </div>
                            <div style={{ fontSize: 16, opacity: 0.9, marginBottom: 14 }}>
                                Result: <b>{finalScore}</b> / <b>{finalTotal}</b>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    padding: "10px 14px",
                                    cursor: "pointer",
                                    background: "#2563eb",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 10,
                                    fontWeight: 700,
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
