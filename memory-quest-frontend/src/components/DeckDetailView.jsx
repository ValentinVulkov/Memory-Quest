import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDeck, fetchCards, createCard, deleteCard } from "../api";
import CardViewerModal from "./CardViewModal";
import React from "react";

export default function DeckDetailView({ token, userId }) {
    const { deckId } = useParams();

    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [msg, setMsg] = useState("");

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    // Viewing mode (read cards one-by-one)
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerStartIndex, setViewerStartIndex] = useState(0);

    async function load() {
        const deckData = await fetchDeck(token, deckId);
        const cardsData = await fetchCards(token, deckId);
        setDeck(deckData);
        setCards(cardsData);
    }

    useEffect(() => {
        if (!token) return;
        load();
    }, [token, deckId]);

    async function onCreate(e) {
        e.preventDefault();

        const q = question.trim();
        const a = answer.trim();
        if (!q || !a) {
            setMsg("Question and answer are required.");
            return;
        }

        setMsg("Creating card...");

        try {
            await createCard(token, deckId, q, a);
            setQuestion("");
            setAnswer("");
            setMsg("✅ Card created");
            await load();
        } catch (e) {
            setMsg("Create card failed: " + (e?.message || String(e)));
        }
    }

    // simple dark styles
    const card = { background: "#1e1e1e", padding: 14, borderRadius: 10, border: "1px solid #2a2a2a" };
    const input = { width: "100%", padding: 12, boxSizing: "border-box", borderRadius: 8, border: "1px solid #333", background: "#111", color: "#fff" };
    const btn = { padding: "10px 12px", cursor: "pointer", background: "#2a2a2a", color: "#fff", border: "1px solid #333", borderRadius: 8 };
    const dangerBtn = { padding: "8px 10px", cursor: "pointer", background: "#991b1b", color: "#fff", border: "1px solid #7f1d1d", borderRadius: 8 };

    const deckTitle = deck ? (deck.title ?? deck.Title ?? `Deck #${deckId}`) : `Deck #${deckId}`;
    const deckOwnerId = deck ? (deck.user_id ?? deck.userId ?? deck.UserID ?? deck.UserId) : null;
    const isOwner = userId != null && deckOwnerId != null && String(userId) === String(deckOwnerId);

    async function onDeleteCard(e, cardId) {
        e.preventDefault();
        e.stopPropagation();
        if (!token) return;
        if (!isOwner) {
            setMsg("You can only delete cards from your own deck.");
            return;
        }
        if (!window.confirm("Delete this card?")) return;

        try {
            setMsg("Deleting card...");
            await deleteCard(token, deckId, cardId);
            setCards((prev) => prev.filter((c) => String(c.id ?? c.ID) !== String(cardId)));
            setMsg("✅ Card deleted");
        } catch (err) {
            setMsg("Delete failed: " + (err?.message || String(err)));
        }
    }

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div style={card}>
                <Link to="/decks" style={{ color: "#fff" }}>← Back to decks</Link>
                <div style={{ marginTop: 10, fontWeight: 800 }}>{deckTitle}</div>

                <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap", marginBottom: -15 }}>
                    <button
                        type="button"
                        onClick={() => { setViewerStartIndex(0); setViewerOpen(true); }}
                        disabled={!cards.length}
                        style={{
                            padding: "24px 56px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            borderRadius: "10px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                            marginBottom: "15px"
                        }}
                    >
                        View
                    </button>

                </div>
            </div>

            <div style={card}>
                <div style={{ fontWeight: 800, marginBottom: 10 }}>Create card</div>
                <form onSubmit={onCreate} style={{ display: "grid", gap: 10 }}>
                    <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Question"
                        style={input}
                    />
                    <input
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Answer"
                        style={input}
                    />
                    <button type="submit" style={btn}>Create</button>
                </form>
            </div>

            <div style={card}>
                <div style={{ fontWeight: 800, marginBottom: 10 }}>Cards</div>

                {cards.length === 0 ? (
                    <div style={{ opacity: 0.7 }}>(No cards yet)</div>
                ) : (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {cards.map((c, i) => {
                            const id = c.id ?? c.ID ?? i;
                            const q = c.question ?? c.Question ?? "";
                            return (
                                <li
                                    key={`${id}-${i}`}
                                    style={{ marginBottom: 10, cursor: "pointer" }}
                                    onClick={() => {
                                        setViewerStartIndex(i);
                                        setViewerOpen(true);
                                    }}
                                    title="Click to open reading mode from here"
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                                        <div style={{ flex: 1 }}><b>Q:</b> {q}</div>
                                        {isOwner && (
                                            <button
                                                type="button"
                                                onClick={(e) => onDeleteCard(e, id)}
                                                style={dangerBtn}
                                                title="Delete card"
                                            >
                                                🗑 Delete
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ opacity: 0.9, marginBottom: 40 }} />
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            <CardViewerModal
                open={viewerOpen}
                cards={cards}
                startIndex={viewerStartIndex}
                onClose={() => setViewerOpen(false)}
            />

            {msg && <pre style={{ ...card, whiteSpace: "pre-wrap", margin: 0 }}>{msg}</pre>}
        </div>
    );
}
