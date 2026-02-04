import { useEffect, useMemo, useState } from "react";
import React from "react";

export default function CardViewerModal({ open, cards, startIndex = 0, onClose }) {
    const list = useMemo(() => (Array.isArray(cards) ? cards : []), [cards]);

    const [index, setIndex] = useState(startIndex);
    const [flipped, setFlipped] = useState(false);

    // Reset when opened / when cards change
    useEffect(() => {
        if (open) {
            setIndex(startIndex);
            setFlipped(false);
        }
    }, [open, startIndex, list.length]);

    function curCard() {
        const c = list[index] || {};
        const q = c.question ?? c.Question ?? "";
        const a = c.answer ?? c.Answer ?? "";
        return { q, a };
    }

    function prev() {
        if (list.length === 0) return;
        setIndex((i) => (i - 1 + list.length) % list.length);
        setFlipped(false);
    }

    function next() {
        if (list.length === 0) return;
        setIndex((i) => (i + 1) % list.length);
        setFlipped(false);
    }

    // Keyboard support: Esc closes, arrows navigate, Space/Enter flips
    useEffect(() => {
        if (!open) return;

        function onKeyDown(e) {
            if (e.key === "Escape") onClose?.();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                setFlipped((f) => !f);
            }
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, list.length, onClose]);

    if (!open) return null;

    const { q, a } = curCard();

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

    const topRow = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    };

    const btn = {
        padding: "10px 12px",
        cursor: "pointer",
        background: "#1f1f1f",
        color: "#fff",
        border: "1px solid #2f2f2f",
        borderRadius: 10,
    };

    const cardBox = {
        userSelect: "none",
        cursor: list.length ? "pointer" : "default",
        background: "#2a2a2a",
        border: "1px solid #2a2a2a",
        borderRadius: 14,
        padding: 24,
        minHeight: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontSize: 22,
        lineHeight: 1.3,
    };

    const footer = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        marginTop: 12,
    };

    const flipWrap = {
        perspective: "1200px",
    };

    const flipCard = {
        position: "relative",
        width: "100%",
        minHeight: 240,
        transformStyle: "preserve-3d",
        transition: "transform 300ms ease",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
    };

    const face = {
        position: "absolute",
        inset: 0,
        background: "#2a2a2a",
        border: "2px solid #3a3a3a",              // ✅ visible border
        borderRadius: 14,
        padding: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontSize: 22,
        lineHeight: 1.3,
        backfaceVisibility: "hidden",
        userSelect: "none",
        boxShadow: "0 12px 30px rgba(0,0,0,0.45)", // ✅ depth
    };

    const backFace = {
        ...face,
        transform: "rotateY(180deg)",
    };


    return (
        <div style={overlay} onClick={onClose}>
            <div style={panel} onClick={(e) => e.stopPropagation()}>
                <div style={topRow}>
                    <div style={{ opacity: 0.85 }}>
                        Viewing mode • {list.length === 0 ? "0" : index + 1}/{list.length}
                    </div>
                    <button type="button" style={btn} onClick={onClose}>
                        ✕ Close
                    </button>
                </div>

                <div style={flipWrap}>
                    <div
                        style={{ ...flipCard, cursor: list.length ? "pointer" : "default" }}
                        onClick={() => {
                            if (!list.length) return;
                            setFlipped((f) => !f);
                        }}
                        title="Click to flip (or press Space)"
                    >
                        {/* FRONT (Question) */}
                        <div style={face}>
                            {list.length === 0 ? (
                                <div style={{ opacity: 0.7 }}>(No cards in this deck)</div>
                            ) : (
                                <div>
                                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>QUESTION</div>
                                    {q || <span style={{ opacity: 0.7 }}>(empty)</span>}
                                </div>
                            )}
                        </div>

                        {/* BACK (Answer) */}
                        <div style={backFace}>
                            {list.length === 0 ? (
                                <div style={{ opacity: 0.7 }}>(No cards in this deck)</div>
                            ) : (
                                <div>
                                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>ANSWER</div>
                                    {a || <span style={{ opacity: 0.7 }}>(empty)</span>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={footer}>
                    <button type="button" style={btn} onClick={prev} disabled={!list.length}>
                        ←
                    </button>

                    <div style={{ opacity: 0.75, fontSize: 13 }}>
                        Click card to flip • ←/→ navigate • Esc closes
                    </div>

                    <button type="button" style={btn} onClick={next} disabled={!list.length}>
                        →
                    </button>
                </div>
            </div>
        </div>
    );
}
