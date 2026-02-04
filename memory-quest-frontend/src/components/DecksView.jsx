import { Link } from "react-router-dom";
import React, { useMemo, useState } from "react";

export default function DecksView({
                                      token,
                                      authOk,
                                      decks,
                                      publicDecks,
                                      deckTitle,
                                      setDeckTitle,
                                      deckDescription,
                                      setDeckDescription,
                                      onCreateDeck
                                  }) {
    const card = { background: "#2a2a2a", padding: 14, borderRadius: 10 };
    const input = { width: "100%", padding: 12, boxSizing: "border-box" };
    const myDecks = useMemo(() => (Array.isArray(decks) ? decks : []), [decks]);
    const pubDecks = useMemo(() => (Array.isArray(publicDecks) ? publicDecks : []), [publicDecks]);

    const [tab, setTab] = useState("mine"); // 'mine' | 'public'

    const list = tab === "public" ? pubDecks : myDecks;

    const tabBtn = (active) => ({
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid #3a3a3a",
        background: active ? "#1f1f1f" : "#2a2a2a",
        color: "#fff",
        cursor: "pointer",
    });


    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div style={card}>
                Status: {token ? (authOk ? "✅ Authorized" : "⏳ Checking...") : "🔒 Login required"}
            </div>

            <div style={card}>
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    <button type="button" style={tabBtn(tab === "mine")} onClick={() => setTab("mine")}>
                        My decks
                    </button>
                    <button type="button" style={tabBtn(tab === "public")} onClick={() => setTab("public")}>
                        Public decks
                    </button>
                </div>

                {tab === "mine" && (
                    <form onSubmit={onCreateDeck} style={{ display: "grid", gap: 10 }}>
                        <input value={deckTitle} onChange={e => setDeckTitle(e.target.value)} placeholder="Deck title" style={input} disabled={!token} />
                        <input value={deckDescription} onChange={e => setDeckDescription(e.target.value)} placeholder="Description" style={input} disabled={!token} />
                        <button disabled={!token}>Create</button>
                    </form>
                )}
            </div>

            <div style={card}>
                {list.length === 0 ? (
                    tab === "public" ? "(No public decks yet)" : "(No decks yet)"
                ) : (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {list.map((d, i) => {
                            const deckId = d.id ?? d.ID ?? d.Id ?? i;
                            const title = d.title ?? d.Title ?? "(untitled)";
                            const desc = d.description ?? d.Description ?? "";
                            const isPublic = d.is_public ?? d.IsPublic ?? false;


                            return (
                                <li key={`${deckId}-${i}`}>
                                    <Link to={`/decks/${deckId}`} style={{ color: "inherit" }}>
                                        <b>{title}</b>
                                    </Link>
                                    <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.7 }}>
                                        {isPublic ? "(public)" : "(private)"}
                                    </span>
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
