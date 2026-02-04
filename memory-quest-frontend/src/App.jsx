import { useEffect, useState } from "react";
import React from "react";
import TopBar from "./components/TopBar";
import DecksView from "./components/DecksView";
import AuthModal from "./components/AuthModal";
import { loginUser, registerUser, fetchDecks, createDeck, fetchProfile } from "./api";
import DeckDetailView from "./components/DeckDetailView";
import { Routes, Route, Navigate } from "react-router-dom";

export default function App() {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [authOk, setAuthOk] = useState(false);
    const [userId, setUserId] = useState(null);
    const [decks, setDecks] = useState([]);
    const [msg, setMsg] = useState("");

    const [authOpen, setAuthOpen] = useState(false);
    const [mode, setMode] = useState("login");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("v@v.com");
    const [password, setPassword] = useState("123456");
    const [showPassword, setShowPassword] = useState(false);

    const [deckTitle, setDeckTitle] = useState("");
    const [deckDescription, setDeckDescription] = useState("");

    useEffect(() => {
        if (!token) setAuthOpen(true);
    }, [token]);

    async function loadDecks(t) {
        try {
            const d = await fetchDecks(t);
            setDecks(Array.isArray(d) ? d : []);
            setAuthOk(true);
        } catch (e) {
            setAuthOk(false);
            setDecks([]);
            setMsg("Deck load failed: " + (e?.message || String(e)));
        }
    }

    useEffect(() => {
        if (!token) return;
        setMsg("");
        loadDecks(token);
    }, [token]);

    useEffect(() => {
        if (!token) {
            setUserId(null);
            return;
        }
        // Who am I? Needed for ownership-only UI (e.g. delete card)
        fetchProfile(token)
            .then((p) => setUserId(p?.user_id ?? p?.userId ?? null))
            .catch(() => setUserId(null));
    }, [token]);

    async function login(e) {
        e.preventDefault();
        setMsg("");
        try {
            const data = await loginUser(email, password);
            const t = data.token;
            if (!t) throw new Error("No token returned");
            localStorage.setItem("token", t);
            setToken(t);
            setAuthOpen(false);
            setAuthOk(false);
        } catch (e) {
            setMsg("Login failed: " + (e?.message || String(e)));
        }
    }

    async function register(e) {
        e.preventDefault();
        setMsg("");
        try {
            await registerUser(username, email, password);
            setMode("login");
            setMsg("✅ Registered. Now login.");
        } catch (e) {
            setMsg("Register failed: " + (e?.message || String(e)));
        }
    }

    async function addDeck(e) {
        e.preventDefault();
        if (!token) return;

        setMsg("");
        try {
            await createDeck(token, deckTitle, deckDescription);
            setDeckTitle("");
            setDeckDescription("");
            await loadDecks(token);
            setMsg("✅ Deck created");
        } catch (e) {
            setMsg("Create deck failed: " + (e?.message || String(e)));
        }
    }

    return (
        <div style={{ maxWidth: 900, margin: "40px auto" }}>
            <TopBar
                token={token}
                onOpenAuth={() => setAuthOpen(true)}
                onLogout={() => {
                    localStorage.removeItem("token");
                    setToken("");
                    setUserId(null);
                    setDecks([]);
                    setAuthOk(false);
                }}
            />
            <Routes>
                <Route path="/" element={<Navigate to="/decks" replace />} />
                <Route
                    path="/decks"
                    element={
                        <DecksView
                            token={token}
                            authOk={authOk}
                            decks={decks}
                            deckTitle={deckTitle}
                            setDeckTitle={setDeckTitle}
                            deckDescription={deckDescription}
                            setDeckDescription={setDeckDescription}
                            onCreateDeck={addDeck}
                        />
                    }
                />
                <Route path="/decks/:deckId" element={<DeckDetailView token={token} userId={userId} />} />
            </Routes>

            <AuthModal
                open={authOpen}
                token={token}
                mode={mode}
                setMode={setMode}
                username={username}
                setUsername={setUsername}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onLogin={login}
                onRegister={register}
                onClose={() => setAuthOpen(false)}
            />

            {msg && (
                <pre style={{ marginTop: 12, background: "#000", color: "#fff", padding: 12, borderRadius: 8 }}>
          {msg}
        </pre>
            )}
        </div>
    );
}
