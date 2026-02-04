import { Link } from "react-router-dom";
import React from "react";

export default function DecksView({
                                      token,
                                      authOk,
                                      decks,
                                      deckTitle,
                                      setDeckTitle,
                                      deckDescription,
                                      setDeckDescription,
                                      onCreateDeck
                                  }) {
    const card = { background: "#2a2a2a", padding: 14, borderRadius: 10 };
    const input = { width: "100%", padding: 12, boxSizing: "border-box" };
    const deckList = Array.isArray(decks) ? decks : [];


    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div style={card}>
                Status: {token ? (authOk ? "✅ Authorized" : "⏳ Checking...") : "🔒 Login required"}
            </div>

            <div style={card}>
                <form onSubmit={onCreateDeck} style={{ display: "grid", gap: 10 }}>
                    <input value={deckTitle} onChange={e => setDeckTitle(e.target.value)} placeholder="Deck title" style={input} disabled={!token} />
                    <input value={deckDescription} onChange={e => setDeckDescription(e.target.value)} placeholder="Description" style={input} disabled={!token} />
                    <button disabled={!token}>Create</button>
                </form>
            </div>

            <div style={card}>
                {deckList.length === 0 ? (
                    "(No decks yet)"
                ) : (
                    <ul>
                        {deckList.map((d, i) => {
                            const deckId = d.id ?? d.ID ?? d.Id ?? i;
                            const title = d.title ?? d.Title ?? "(untitled)";
                            const desc = d.description ?? d.Description ?? "";


                            return (
                                <li key={`${deckId}-${i}`}>
                                    <Link to={`/decks/${deckId}`} style={{ color: "inherit" }}>
                                        <b>{title}</b>
                                    </Link>
                                    {desc ? ` — ${desc}` : ""}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
